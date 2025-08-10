using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class City
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? State { get; set; }

    public string? CountryIso2 { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public string? Timezone { get; set; }

    public int? Population { get; set; }

    public virtual ICollection<Airport> Airports { get; set; } = new List<Airport>();

    public virtual Country? CountryIso2Navigation { get; set; }
}
