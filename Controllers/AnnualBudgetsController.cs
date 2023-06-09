using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ppm360.Data;
using ppm360.Models;

namespace ppm360.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnualBudgetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnnualBudgetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AnnualBudgets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnnualBudget>>> GetAnnualBudget()
        {
          if (_context.AnnualBudget == null)
          {
              return NotFound();
          }
            return await _context.AnnualBudget.ToListAsync();
        }

        // GET: api/AnnualBudgets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnnualBudget>> GetAnnualBudget(int id)
        {
          if (_context.AnnualBudget == null)
          {
              return NotFound();
          }
            var annualBudget = await _context.AnnualBudget.FindAsync(id);

            if (annualBudget == null)
            {
                return NotFound();
            }

            return annualBudget;
        }

        // PUT: api/AnnualBudgets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnualBudget(int id, AnnualBudget annualBudget)
        {
            if (id != annualBudget.Year)
            {
                return BadRequest();
            }

            _context.Entry(annualBudget).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnnualBudgetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AnnualBudgets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AnnualBudget>> PostAnnualBudget(AnnualBudget annualBudget)
        {
          if (_context.AnnualBudget == null)
          {
              return Problem("Entity set 'ApplicationDbContext.AnnualBudget'  is null.");
          }
            _context.AnnualBudget.Add(annualBudget);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnnualBudget", new { id = annualBudget.Year }, annualBudget);
        }

        // DELETE: api/AnnualBudgets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnualBudget(int id)
        {
            if (_context.AnnualBudget == null)
            {
                return NotFound();
            }
            var annualBudget = await _context.AnnualBudget.FindAsync(id);
            if (annualBudget == null)
            {
                return NotFound();
            }

            _context.AnnualBudget.Remove(annualBudget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnnualBudgetExists(int id)
        {
            return (_context.AnnualBudget?.Any(e => e.Year == id)).GetValueOrDefault();
        }
    }
}
