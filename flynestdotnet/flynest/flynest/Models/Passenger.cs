using System;

namespace flynest.Models
{
    public partial class Passenger
    {
        public int PassengerId { get; set; }

        public int? BookingId { get; set; }

        public string? FullName { get; set; }

        public string? Gender { get; set; }

        // Changed Age (int?) to Birthdate (DateTime?)
        public DateTime? Birthdate { get; set; }

        public string? PassportNumber { get; set; }

        public virtual Booking? Booking { get; set; }
    }
}
