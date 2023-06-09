using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ppm360.Models;

namespace ppm360.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Project> Projects { get; set; }

        public DbSet<User> User { get; set; } = default!;

        public DbSet<ppm360.Models.AnnualBudget> AnnualBudget { get; set; } = default!;
    }
}
