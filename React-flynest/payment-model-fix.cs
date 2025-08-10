using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace flynest.Models
{
    [Table("payment")] // Specify the table name
    public partial class Payment
    {
        [Key]
        [Column("payment_id")]
        public int PaymentId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("booking_id")]
        public int? BookingId { get; set; }

        [Column("stripe_payment_id")]
        public string? StripePaymentId { get; set; }

        [Column("amount")]
        public decimal? Amount { get; set; }

        [Column("currency")]
        public string? Currency { get; set; }

        [Column("payment_status")]
        public string? PaymentStatus { get; set; }

        [Column("payment_method_type")]
        public string? PaymentMethodType { get; set; }

        [Column("receipt_url")]
        public string? ReceiptUrl { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        public virtual Booking? Booking { get; set; }
        public virtual User? User { get; set; }
    }
} 