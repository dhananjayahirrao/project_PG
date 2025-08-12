using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Flight
{
    public long Id { get; set; }

    public DateOnly? FlightDate { get; set; }

    public string? FlightStatus { get; set; }

    public string? DepartureAirport { get; set; }

    public string? DepartureIata { get; set; }

    public string? DepartureIcao { get; set; }

    public string? DepartureTerminal { get; set; }

    public string? DepartureGate { get; set; }

    public int? DepartureDelay { get; set; }

    public TimeOnly? DepartureTime { get; set; }  // ✅ new column

    public string? ArrivalAirport { get; set; }

    public string? ArrivalIata { get; set; }

    public string? ArrivalIcao { get; set; }

    public string? ArrivalTerminal { get; set; }

    public string? ArrivalGate { get; set; }

    public string? ArrivalBaggage { get; set; }

    public int? ArrivalDelay { get; set; }

    public TimeOnly? ArrivalTime { get; set; }  // ✅ new column

    public string? AirlineName { get; set; }

    public string? AirlineIata { get; set; }

    public string? AirlineIcao { get; set; }

    public string? FlightNumber { get; set; }

    public int? AircraftId { get; set; }

    public decimal? Price { get; set; }

    public virtual Airplane? Aircraft { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
