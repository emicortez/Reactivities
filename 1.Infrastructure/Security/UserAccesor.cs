using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace Infrastructure.Security
{
    public class UserAccesor : IUserAccesor
    {
        private readonly IHttpContextAccessor _httpContextAccesor;

        public UserAccesor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccesor = httpContextAccessor;
        }
        public string GetCurrentUsername()
        {
            var username = _httpContextAccesor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            return username;
        }
    }
}
