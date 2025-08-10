using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Airplane
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Model { get; set; }

    public string? RegistrationNumber { get; set; }

    public string? AirlineIata { get; set; }

    public int? Capacity { get; set; }

    public virtual Airline? AirlineIataNavigation { get; set; }

    public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();
}
