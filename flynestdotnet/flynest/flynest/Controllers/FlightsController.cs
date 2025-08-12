using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using flynest.Models;

namespace flynest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly FlynestDbContext _context;

        public FlightsController(FlynestDbContext context)
        {
            _context = context;
        }

        // GET: api/Flights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlights()
        {
            return await _context.Flights.ToListAsync();
        }

        // GET: api/Flights/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Flight>> GetFlight(long id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
                return NotFound();

            return flight;
        }

        // ✅ Search flights by departureAirport, arrivalAirport, and flightDate
        // Example: api/Flights/search?departureAirport=Delhi&arrivalAirport=Mumbai&flightDate=2025-08-10
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Flight>>> SearchFlights(
            [FromQuery] string departureAirport,
            [FromQuery] string arrivalAirport,
            [FromQuery] string flightDate)
        {
            Console.WriteLine($"Searching: from={departureAirport}, to={arrivalAirport}, date={flightDate}");

            if (!DateOnly.TryParse(flightDate, out var parsedDate))
            {
                Console.WriteLine("❌ Date parse failed");
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            var flights = await _context.Flights
                .Include(f => f.Aircraft)
                .Where(f =>
                    f.DepartureAirport != null && f.DepartureAirport.Contains(departureAirport) &&
                    f.ArrivalAirport != null && f.ArrivalAirport.Contains(arrivalAirport) &&
                    f.FlightDate == parsedDate &&
                    f.FlightStatus != "Cancelled" &&
                    f.Price.HasValue && f.Price > 0)
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            if (!flights.Any())
            {
                Console.WriteLine("⚠️ No matching flights");
                return NotFound("No matching flights found.");
            }

            return Ok(flights);
        }



        // GET: api/Flights/search-roundtrip?from=Pune%20Airport&to=Ahmedabad%20Airport&date=2025-08-21&returnDate=2025-08-22
        [HttpGet("search-roundtrip")]
        public async Task<ActionResult<object>> SearchRoundTripFlights(
            [FromQuery] string from,
            [FromQuery] string to,
            [FromQuery] string date,
            [FromQuery] string returnDate)
        {
            if (!DateOnly.TryParse(date, out var parsedDate) ||
                !DateOnly.TryParse(returnDate, out var parsedReturnDate))
            {
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            // Onward flights
            var onwardFlights = await _context.Flights
                .Include(f => f.Aircraft)
                .Where(f =>
                    f.DepartureAirport != null && f.DepartureAirport.Contains(from) &&
                    f.ArrivalAirport != null && f.ArrivalAirport.Contains(to) &&
                    f.FlightDate == parsedDate &&
                    f.FlightStatus != "Cancelled" &&
                    f.Price.HasValue && f.Price > 0)
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            // Return flights
            var returnFlights = await _context.Flights
                .Include(f => f.Aircraft)
                .Where(f =>
                    f.DepartureAirport != null && f.DepartureAirport.Contains(to) &&
                    f.ArrivalAirport != null && f.ArrivalAirport.Contains(from) &&
                    f.FlightDate == parsedReturnDate &&
                    f.FlightStatus != "Cancelled" &&
                    f.Price.HasValue && f.Price > 0)
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            if (!onwardFlights.Any() && !returnFlights.Any())
            {
                return NotFound("No matching onward or return flights found.");
            }

            return Ok(new
            {
                onward = onwardFlights,
                @return = returnFlights
            });
        }




        // ✅ NEW: Search flights for rescheduling - more flexible search
        // Example: api/Flights/search-for-reschedule?from=Delhi&to=Mumbai&date=2025-08-10&passengers=1
        [HttpGet("search-for-reschedule")]
        public async Task<ActionResult<IEnumerable<object>>> SearchFlightsForReschedule(
            [FromQuery] string from,
            [FromQuery] string to,
            [FromQuery] string date)
        {
            Console.WriteLine($"Reschedule search: from={from}, to={to}, date={date}");

            if (!DateOnly.TryParse(date, out var parsedDate))
            {
                Console.WriteLine("❌ Date parse failed");
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            // Search with flexible matching (case-insensitive) and only active flights
            var flights = await _context.Flights
                .Include(f => f.Aircraft) // Include aircraft information
                .Where(f =>
                    f.DepartureAirport != null && f.DepartureAirport.ToLower().Contains(from.ToLower()) &&
                    f.ArrivalAirport != null && f.ArrivalAirport.ToLower().Contains(to.ToLower()) &&
                    f.FlightDate == parsedDate &&
                    f.FlightStatus != "Cancelled" && // Exclude cancelled flights
                    f.Price.HasValue && f.Price > 0) // Only flights with valid pricing
                .OrderBy(f => f.DepartureTime) // Order by departure time
                .ToListAsync();

            if (!flights.Any())
            {
                Console.WriteLine("⚠️ No flights available for rescheduling");
                return NotFound(new
                {
                    message = "No flights available for the selected date and route.",
                    searchCriteria = new { from, to, date }
                });
            }

            // Transform the data to match frontend expectations
            var flightOptions = flights.Select(f => new
            {
                id = f.Id.ToString(),
                flightNumber = f.FlightNumber ?? "Unknown",
                airline = f.AirlineName ?? "Unknown Airline",
                airlineCode = f.AirlineIata ?? f.AirlineIcao ?? "",
                departureTime = f.DepartureTime?.ToString("HH:mm") ?? "TBD",
                arrivalTime = f.ArrivalTime?.ToString("HH:mm") ?? "TBD",
                duration = CalculateFlightDuration(f.DepartureTime, f.ArrivalTime),
                price = f.Price ?? 0,
                aircraft = f.Aircraft?.Model ?? "Unknown Aircraft",
                aircraftId = f.AircraftId,
                departureCity = f.DepartureAirport,
                arrivalCity = f.ArrivalAirport,
                date = f.FlightDate?.ToString("yyyy-MM-dd") ?? date,

                // Airport codes and details
                departureIata = f.DepartureIata,
                departureIcao = f.DepartureIcao,
                departureTerminal = f.DepartureTerminal,
                departureGate = f.DepartureGate,
                arrivalIata = f.ArrivalIata,
                arrivalIcao = f.ArrivalIcao,
                arrivalTerminal = f.ArrivalTerminal,
                arrivalGate = f.ArrivalGate,

                // Flight status and delays
                flightStatus = f.FlightStatus,
                departureDelay = f.DepartureDelay ?? 0,
                arrivalDelay = f.ArrivalDelay ?? 0,

                // Additional fields for rescheduling
                originalPrice = f.Price ?? 0, // You might want to calculate this based on the original booking
                priceDifference = 0, // Will be calculated on frontend based on original booking price

                // Flight details for backend reference
                departureAirport = f.DepartureAirport,
                arrivalAirport = f.ArrivalAirport,
                flightDate = f.FlightDate
            }).ToArray();

            Console.WriteLine($"✅ Found {flightOptions.Length} flights for rescheduling");
            return Ok(flightOptions);
        }

        // ✅ Get all flights for a specific date
        // Example: api/Flights/by-date?date=2025-08-10
        [HttpGet("by-date")]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlightsByDate([FromQuery] DateOnly date)
        {
            var flights = await _context.Flights
                .Include(f => f.Aircraft)
                .Where(f => f.FlightDate == date && f.FlightStatus != "Cancelled")
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return flights.Any() ? Ok(flights) : NotFound("No flights found on this date.");
        }

        // ✅ NEW: Get available dates with flights for a route (helpful for rescheduling)
        // Example: api/Flights/available-dates?from=Delhi&to=Mumbai&startDate=2025-08-10&endDate=2025-12-10
        [HttpGet("available-dates")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableDates(
            [FromQuery] string from,
            [FromQuery] string to,
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            if (!DateOnly.TryParse(startDate, out var start) || !DateOnly.TryParse(endDate, out var end))
            {
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            var availableDates = await _context.Flights
                .Where(f =>
                    f.DepartureAirport != null && f.DepartureAirport.ToLower().Contains(from.ToLower()) &&
                    f.ArrivalAirport != null && f.ArrivalAirport.ToLower().Contains(to.ToLower()) &&
                    f.FlightDate >= start &&
                    f.FlightDate <= end &&
                    f.FlightStatus != "Cancelled" &&
                    f.Price.HasValue && f.Price > 0)
                .GroupBy(f => f.FlightDate)
                .Select(g => new
                {
                    date = g.Key.HasValue ? g.Key.Value.ToString("yyyy-MM-dd") : "",
                    flightCount = g.Count(),
                    minPrice = g.Min(f => f.Price ?? 0),
                    maxPrice = g.Max(f => f.Price ?? 0),
                    airlines = g.Select(f => f.AirlineName).Distinct().Count()
                })
                .Where(x => !string.IsNullOrEmpty(x.date))
                .OrderBy(x => x.date)
                .ToListAsync();

            return Ok(availableDates);
        }

        // PUT: api/Flights/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlight(long id, Flight flight)
        {
            if (id != flight.Id)
                return BadRequest();

            _context.Entry(flight).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Flights
        [HttpPost]
        public async Task<ActionResult<Flight>> PostFlight(Flight flight)
        {
            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFlight), new { id = flight.Id }, flight);
        }

        // DELETE: api/Flights/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(long id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
                return NotFound();

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlightExists(long id)
        {
            return _context.Flights.Any(e => e.Id == id);
        }

        // ✅ Helper method to calculate flight duration
        private string CalculateFlightDuration(TimeOnly? departureTime, TimeOnly? arrivalTime)
        {
            if (!departureTime.HasValue || !arrivalTime.HasValue)
                return "TBD";

            var departure = departureTime.Value;
            var arrival = arrivalTime.Value;

            // Handle overnight flights
            TimeSpan duration;
            if (arrival < departure)
            {
                // Flight goes into next day
                duration = (TimeSpan.FromHours(24) - departure.ToTimeSpan()) + arrival.ToTimeSpan();
            }
            else
            {
                duration = arrival.ToTimeSpan() - departure.ToTimeSpan();
            }

            int hours = (int)duration.TotalHours;
            int minutes = duration.Minutes;

            return $"{hours}h {minutes}m";
        }

        // ✅ Helper method to estimate available seats (since your model doesn't have this field)
      
    }
}