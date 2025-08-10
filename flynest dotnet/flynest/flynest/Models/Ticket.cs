using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int? BookingId { get; set; }

    public string? TicketNumber { get; set; }

    public string? SeatNumber { get; set; }

    public string? Class { get; set; }

    public virtual Booking? Booking { get; set; }
}
