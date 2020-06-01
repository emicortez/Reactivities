using Application.Interfaces;
using Application.Photos.Dtos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<PhotoDto>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, PhotoDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccesor _userAccesor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IUserAccesor userAccesor, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _userAccesor = userAccesor;
                _photoAccessor = photoAccessor;
            }

            public async Task<PhotoDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var photoUploadResult = _photoAccessor.AddPhoto(request.File);

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccesor.GetCurrentUsername());

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId,
                };

                if (!user.Photos.Any(x => x.IsMain))
                    photo.IsMain = true;

                user.Photos.Add(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return new PhotoDto
                    {
                        Id = photo.Id,
                        IsMain = photo.IsMain,
                        Url = photo.Url
                    };

                throw new Exception("Problem saving changes");
            }
        }
    }
}
