using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using flynest.Models;

namespace flynest.Models;

public partial class FlynestDbContext : DbContext
{
    public FlynestDbContext()
    {
    }

    public FlynestDbContext(DbContextOptions<FlynestDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Airline> Airlines { get; set; }

    public virtual DbSet<Airplane> Airplanes { get; set; }

    public virtual DbSet<Airport> Airports { get; set; }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Flight> Flights { get; set; }

    public virtual DbSet<Passenger> Passengers { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DHANU;Initial Catalog=flynest;Integrated Security=True;Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Airline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__airlines__3213E83F0DB332E1");

            entity.ToTable("airlines");

            entity.HasIndex(e => e.IataCode, "UQ__airlines__1B78975C037BDCE1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Callsign)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("callsign");
            entity.Property(e => e.CountryIso2)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("country_iso2");
            entity.Property(e => e.FleetSize).HasColumnName("fleet_size");
            entity.Property(e => e.IataCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("iata_code");
            entity.Property(e => e.IcaoCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("icao_code");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("type");

            entity.HasOne(d => d.CountryIso2Navigation).WithMany(p => p.Airlines)
                .HasPrincipalKey(p => p.Iso2)
                .HasForeignKey(d => d.CountryIso2)
                .HasConstraintName("FK__airlines__countr__76969D2E");
        });

        modelBuilder.Entity<Airplane>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__airplane__3213E83F37FF2C8F");

            entity.ToTable("airplanes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AirlineIata)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("airline_iata");
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.Model)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("model");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.RegistrationNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("registration_number");

            entity.HasOne(d => d.AirlineIataNavigation).WithMany(p => p.Airplanes)
                .HasPrincipalKey(p => p.IataCode)
                .HasForeignKey(d => d.AirlineIata)
                .HasConstraintName("FK__airplanes__airli__7E37BEF6");
        });

        modelBuilder.Entity<Airport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__airports__3213E83F9CED3338");

            entity.ToTable("airports");

            entity.HasIndex(e => e.IataCode, "UQ__airports__1B78975CA9A7F2C0").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.CityId).HasColumnName("city_id");
            entity.Property(e => e.CountryIso2)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("country_iso2");
            entity.Property(e => e.Elevation).HasColumnName("elevation");
            entity.Property(e => e.IataCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("iata_code");
            entity.Property(e => e.IcaoCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("icao_code");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("state");
            entity.Property(e => e.Timezone)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("timezone");

            entity.HasOne(d => d.CityNavigation).WithMany(p => p.Airports)
                .HasForeignKey(d => d.CityId)
                .HasConstraintName("FK__airports__city_i__7A672E12");

            entity.HasOne(d => d.CountryIso2Navigation).WithMany(p => p.Airports)
                .HasPrincipalKey(p => p.Iso2)
                .HasForeignKey(d => d.CountryIso2)
                .HasConstraintName("FK__airports__countr__7B5B524B");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__booking__5DE3A5B163DB0718");

            entity.ToTable("booking");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");

            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.Property(e => e.FlightId).HasColumnName("flight_id");

            entity.Property(e => e.FlightNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("flight_number");

            entity.Property(e => e.DepartureCity)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("departure_city");

            entity.Property(e => e.ArrivalCity)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("arrival_city");

            entity.Property(e => e.FlightDate)
                .HasColumnType("date")
                .HasColumnName("flight_date");

            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");

            entity.Property(e => e.BookingDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("booking_date");

            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.Flight).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.FlightId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__booking__flight___0B91BA14");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__booking__user_id__0A9D95DB");
        });


        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__cities__3213E83FD2A1B244");

            entity.ToTable("cities");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CountryIso2)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("country_iso2");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Population).HasColumnName("population");
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("state");
            entity.Property(e => e.Timezone)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("timezone");

            entity.HasOne(d => d.CountryIso2Navigation).WithMany(p => p.Cities)
                .HasPrincipalKey(p => p.Iso2)
                .HasForeignKey(d => d.CountryIso2)
                .HasConstraintName("FK__cities__country___72C60C4A");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__countrie__3213E83F7B8633DE");

            entity.ToTable("countries");

            entity.HasIndex(e => e.Iso2, "UQ__countrie__99F94A9AAFB5D754").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Capital)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("capital");
            entity.Property(e => e.Currency)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("currency");
            entity.Property(e => e.CurrencyName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("currency_name");
            entity.Property(e => e.CurrencySymbol)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("currency_symbol");
            entity.Property(e => e.Iso2)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("iso2");
            entity.Property(e => e.Iso3)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("iso3");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Native)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("native");
            entity.Property(e => e.NumericCode).HasColumnName("numeric_code");
            entity.Property(e => e.PhoneCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone_code");
            entity.Property(e => e.Region)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("region");
            entity.Property(e => e.Subregion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("subregion");
            entity.Property(e => e.Timezones).HasColumnName("timezones");
            entity.Property(e => e.Tld)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("tld");
            entity.Property(e => e.Translations).HasColumnName("translations");
        });

        modelBuilder.Entity<Flight>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__flights__3213E83F78FCD414");

            entity.ToTable("flights");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.FlightDate).HasColumnName("flight_date");

            entity.Property(e => e.FlightStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("flight_status");

            entity.Property(e => e.DepartureAirport)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("departure_airport");

            entity.Property(e => e.DepartureIata)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("departure_iata");

            entity.Property(e => e.DepartureIcao)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("departure_icao");

            entity.Property(e => e.DepartureTerminal)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("departure_terminal");

            entity.Property(e => e.DepartureGate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("departure_gate");

            entity.Property(e => e.DepartureDelay).HasColumnName("departure_delay");

            entity.Property(e => e.DepartureTime) // ✅ new column
                .HasColumnName("departure_time");

            entity.Property(e => e.ArrivalAirport)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("arrival_airport");

            entity.Property(e => e.ArrivalIata)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("arrival_iata");

            entity.Property(e => e.ArrivalIcao)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("arrival_icao");

            entity.Property(e => e.ArrivalTerminal)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("arrival_terminal");

            entity.Property(e => e.ArrivalGate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("arrival_gate");

            entity.Property(e => e.ArrivalBaggage)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("arrival_baggage");

            entity.Property(e => e.ArrivalDelay).HasColumnName("arrival_delay");

            entity.Property(e => e.ArrivalTime) // ✅ new column
                .HasColumnName("arrival_time");

            entity.Property(e => e.AirlineName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("airline_name");

            entity.Property(e => e.AirlineIata)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("airline_iata");

            entity.Property(e => e.AirlineIcao)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("airline_icao");

            entity.Property(e => e.FlightNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("flight_number");

            entity.Property(e => e.AircraftId).HasColumnName("aircraft_id");

            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");

            entity.HasOne(d => d.Aircraft).WithMany(p => p.Flights)
                .HasForeignKey(d => d.AircraftId)
                .HasConstraintName("FK__flights__aircraf__01142BA1");
        });



        modelBuilder.Entity<Passenger>(entity =>
        {
            entity.HasKey(e => e.PassengerId).HasName("PK__passenge__03764586EEF32948");

            entity.ToTable("passengers");

            entity.HasIndex(e => e.PassportNumber, "UQ__passenge__D2CA62997076EFAC").IsUnique();

            entity.Property(e => e.PassengerId).HasColumnName("passenger_id");

            // Removed Age mapping:
            // entity.Property(e => e.Age).HasColumnName("age");

            // Added Birthdate mapping:
            entity.Property(e => e.Birthdate)
                  .HasColumnName("birthdate")
                  .HasColumnType("datetime");  // use "datetime" if your column is datetime type

            entity.Property(e => e.BookingId).HasColumnName("booking_id");

            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("full_name");

            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("gender");

            entity.Property(e => e.PassportNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("passport_number");

            entity.HasOne(d => d.Booking).WithMany(p => p.Passengers)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__passenger__booki__10566F31");
        });


        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__payment__ED1FC9EAC6B12452");

            entity.ToTable("payment");

            entity.HasIndex(e => e.StripePaymentId, "UQ__payment__15FA69488609BD5D").IsUnique();

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");

            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");

            entity.Property(e => e.UserId).HasColumnName("user_id"); // ✅ NEW

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");

            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("currency");

            entity.Property(e => e.PaymentMethodType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("payment_method_type");

            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("payment_status");

            entity.Property(e => e.ReceiptUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("receipt_url");

            entity.Property(e => e.StripePaymentId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("stripe_payment_id");

            entity.HasOne(d => d.Booking)
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__payment__booking__1AD3FDA4");

            entity.HasOne(d => d.User) // ✅ NEW
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_payment_user"); // ✅ optional custom FK name
        });


        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__ticket__D596F96BDAF64AFB");

            entity.ToTable("ticket");

            entity.HasIndex(e => e.TicketNumber, "UQ__ticket__413613D21B732C31").IsUnique();

            entity.Property(e => e.TicketId).HasColumnName("ticket_id");
            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.Class)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("class");
            entity.Property(e => e.SeatNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("seat_number");
            entity.Property(e => e.TicketNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ticket_number");

            entity.HasOne(d => d.Booking).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ticket__booking___151B244E");
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__AD050083");

            entity.ToTable("Admin");

            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.AdminId).HasColumnName("admin_id");
            entity.Property(e => e.Username).HasMaxLength(50).IsUnicode(false).HasColumnName("username");
            entity.Property(e => e.Email).HasMaxLength(100).IsUnicode(false).HasColumnName("email");
            entity.Property(e => e.Password).HasMaxLength(255).IsUnicode(false).HasColumnName("password");
            entity.Property(e => e.AdminName).HasMaxLength(100).IsUnicode(false).HasColumnName("admin_name");
            entity.Property(e => e.LastLogin).HasColumnType("datetime").HasColumnName("last_login");
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("(getdate())")
                  .HasColumnType("datetime")
                  .HasColumnName("created_at");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
        });


        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__B9BE370F96F4FA7A");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "UQ__users__AB6E6164FD6CB323").IsUnique();

            entity.HasIndex(e => e.Phone, "UQ__users__B43B145FA6527390").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

public DbSet<flynest.Models.Admin> Admin { get; set; } = default!;
}
