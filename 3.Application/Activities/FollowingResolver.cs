using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccesor _userAccesor;

        public FollowingResolver(DataContext context, IUserAccesor userAccesor )
        {
            _context = context;
            _userAccesor = userAccesor;
        }

        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccesor.GetCurrentUsername()).Result;

            return currentUser.Followings.Any(x => x.TargetId == source.AppUserId);
        }
    }
}
