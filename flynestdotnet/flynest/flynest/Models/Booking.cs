using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? UserId { get; set; }

    public long? FlightId { get; set; }

    public string? FlightNumber { get; set; }

    public string? DepartureCity { get; set; }

    public string? ArrivalCity { get; set; }

    public DateTime? FlightDate { get; set; }

    public decimal? Amount { get; set; }

    public DateTime? BookingDate { get; set; }

    public string? Status { get; set; }

    public virtual User? User { get; set; }

    public virtual Flight? Flight { get; set; }

    public virtual ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
