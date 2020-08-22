using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class RefreshToken
    {
        public class Command : IRequest<User>
        {
            public string RefreshToken { get; set; }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccesor _userAccesor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccesor userAccesor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccesor = userAccesor;
            }
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccesor.GetCurrentUsername());

                var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == request.RefreshToken);

                if (oldToken != null && !oldToken.IsActive)
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);

                if (oldToken != null)
                {
                    oldToken.Revoked = DateTime.UtcNow;
                }

                var newRefreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(newRefreshToken);

                await _userManager.UpdateAsync(user);

                return new User(user, _jwtGenerator, newRefreshToken.Token);
            }
        }
    }
}
