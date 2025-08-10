using System;
using System.Collections.Generic;

namespace flynest.Models;

public partial class Country
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Iso2 { get; set; } = null!;

    public string? Iso3 { get; set; }

    public int? NumericCode { get; set; }

    public string? PhoneCode { get; set; }

    public string? Capital { get; set; }

    public string? Currency { get; set; }

    public string? CurrencyName { get; set; }

    public string? CurrencySymbol { get; set; }

    public string? Tld { get; set; }

    public string? Native { get; set; }

    public string? Region { get; set; }

    public string? Subregion { get; set; }

    public string? Timezones { get; set; }

    public string? Translations { get; set; }

    public virtual ICollection<Airline> Airlines { get; set; } = new List<Airline>();

    public virtual ICollection<Airport> Airports { get; set; } = new List<Airport>();

    public virtual ICollection<City> Cities { get; set; } = new List<City>();
}
