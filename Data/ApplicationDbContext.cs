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

        public DbSet<ppm360.Models.User> User { get; set; } = default!;
    }
}