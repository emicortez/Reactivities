using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        //public class CommonValidator : AbstractValidator<Command>
        //{
        //    public CommonValidator()
        //    {
        //        RuleFor(x => x.Title).NotEmpty();
        //        RuleFor(x => x.Description).NotEmpty();
        //        RuleFor(x => x.Category).NotEmpty();
        //        RuleFor(x => x.Date).NotEmpty();
        //        RuleFor(x => x.City).NotEmpty();
        //        RuleFor(x => x.Venue).NotEmpty();
        //    }
        //}

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Activity = "Not found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Body = request.Body,
                    Activity = activity,
                    CreatedAt = DateTime.Now,
                    Author = user
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}
