using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Airport
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? IataCode { get; set; }

    public string? IcaoCode { get; set; }

    public int? CityId { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? CountryIso2 { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public int? Elevation { get; set; }

    public string? Timezone { get; set; }

    public virtual City? CityNavigation { get; set; }

    public virtual Country? CountryIso2Navigation { get; set; }
}
