using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ppm360.Data;
using ppm360.Models;

using Microsoft.IdentityModel.Tokens;   
using System;   
using System.Text;
using System.IdentityModel.Tokens.Jwt;   
using System.Security.Claims; 

namespace ppm360.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

  
        [HttpPost("register")]
        public async Task<ActionResult<IEnumerable<User>>> Register(UserDto request)
        {

            if(UserExists(request.Username)) {
                return BadRequest("User already exists.");
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Applicant"
            };

            if (_context.User == null)
            {
                return Problem("Entity set 'ApplicationDbContext.User' is null.");
            }

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<IEnumerable<User>>> Login(UserDto request)
        {
            if (!UserExists(request.Username))
            {
                return BadRequest("Invalid username or password. (1)");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, GetUser(request.Username).PasswordHash))
            {
                return BadRequest("Invalid username or password. (2)");
            }

            string token = CreateToken(GetUser(request.Username));

            return Ok(new { success = true, token });
        }

        

        private User GetUser(string username)
        {
            return _context.User.FirstOrDefault(u => u.Username == username);
        }

        private bool UserExists(string username)
        {
            return (_context.User?.Any(e => e.Username == username)).GetValueOrDefault();
        }

        private string CreateToken(User user) {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
