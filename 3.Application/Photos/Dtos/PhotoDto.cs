using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Photos.Dtos
{
    public class PhotoDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}
