﻿// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschränkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System;
using System.Globalization;
using System.IO;

namespace Squidex.Infrastructure
{
    public static class FileExtensions
    {
        private static readonly string[] Extensions =
        {
            "bytes",
            "kB",
            "MB",
            "GB",
            "TB"
        };

        public static string FileType(this string fileName)
        {
            try
            {
                var fileInfo = new FileInfo(fileName);

                return fileInfo.Extension.Substring(1).ToLowerInvariant();
            }
            catch
            {
                return "blob";
            }
        }

        public static string ToReadableSize(this int value)
        {
            return ToReadableSize((long)value);
        }

        public static string ToReadableSize(this long value)
        {
            if (value < 0)
            {
                return string.Empty;
            }

            var d = (double)value;
            var u = 0;
            var s = 1024;

            while ((d >= s || -d >= s) && u < Extensions.Length - 1)
            {
                d /= s;
                u++;
            }

            if (u >= Extensions.Length - 1)
            {
                u = Extensions.Length - 1;
            }

            return $"{Math.Round(d, 1).ToString(CultureInfo.InvariantCulture)} {Extensions[u]}";
        }
    }
}
