using System;
using System.Collections.Generic;

namespace flynest.Models
{
    public partial class Payment
    {
        public int PaymentId { get; set; }

        public int? BookingId { get; set; }

        public string? StripePaymentId { get; set; }

        public decimal? Amount { get; set; }

        public string? Currency { get; set; }

        public string? PaymentStatus { get; set; }

        public string? PaymentMethodType { get; set; }

        public string? ReceiptUrl { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int? UserId { get; set; } // ✅ Newly added

        public virtual Booking? Booking { get; set; }

        public virtual User? User { get; set; } // ✅ Navigation property

    }
}
