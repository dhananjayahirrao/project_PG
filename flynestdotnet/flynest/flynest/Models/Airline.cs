using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Airline
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string IataCode { get; set; } = null!;

    public string? IcaoCode { get; set; }

    public string? Callsign { get; set; }

    public string? CountryIso2 { get; set; }

    public string? Type { get; set; }

    public string? Status { get; set; }

    public int? FleetSize { get; set; }

    public virtual ICollection<Airplane> Airplanes { get; set; } = new List<Airplane>();

    public virtual Country? CountryIso2Navigation { get; set; }
}
