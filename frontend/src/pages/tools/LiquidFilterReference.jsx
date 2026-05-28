import { useState, useEffect } from 'react'

const FILTER_GROUPS = [
  {
    category: 'String',
    color: 'blue',
    filters: [
      { name: 'upcase', syntax: 'string | upcase', example: '{{ "hello" | upcase }}', output: 'HELLO', desc: 'Converts all characters to uppercase.' },
      { name: 'downcase', syntax: 'string | downcase', example: '{{ "HELLO" | downcase }}', output: 'hello', desc: 'Converts all characters to lowercase.' },
      { name: 'capitalize', syntax: 'string | capitalize', example: '{{ "hello world" | capitalize }}', output: 'Hello world', desc: 'Capitalises the first character and downcases the rest.' },
      { name: 'strip', syntax: 'string | strip', example: '{{ "  hello  " | strip }}', output: 'hello', desc: 'Removes whitespace (including newlines) from both ends of a string.' },
      { name: 'lstrip', syntax: 'string | lstrip', example: '{{ "  hello  " | lstrip }}', output: 'hello  ', desc: 'Removes whitespace from the left side only.' },
      { name: 'rstrip', syntax: 'string | rstrip', example: '{{ "  hello  " | rstrip }}', output: '  hello', desc: 'Removes whitespace from the right side only.' },
      { name: 'strip_html', syntax: 'string | strip_html', example: '{{ "<p>Hello</p>" | strip_html }}', output: 'Hello', desc: 'Removes all HTML tags from a string.' },
      { name: 'strip_newlines', syntax: 'string | strip_newlines', example: '{{ "Hello\\nWorld" | strip_newlines }}', output: 'HelloWorld', desc: 'Removes all newline characters (\\n) from a string.' },
      { name: 'newline_to_br', syntax: 'string | newline_to_br', example: '{{ "Hello\\nWorld" | newline_to_br }}', output: 'Hello<br/>World', desc: 'Converts newline characters to HTML <br/> tags.' },
      { name: 'split', syntax: 'string | split: "delimiter"', example: '{{ "a,b,c" | split: "," }}', output: '["a","b","c"]', desc: 'Splits a string into an array on the given delimiter.' },
      { name: 'replace', syntax: 'string | replace: "old", "new"', example: '{{ "hello world" | replace: "world", "Shopify" }}', output: 'hello Shopify', desc: 'Replaces every occurrence of the first argument with the second.' },
      { name: 'replace_first', syntax: 'string | replace_first: "old", "new"', example: '{{ "aabbaa" | replace_first: "aa", "XX" }}', output: 'XXbbaa', desc: 'Replaces only the first occurrence of the search string.' },
      { name: 'replace_last', syntax: 'string | replace_last: "old", "new"', example: '{{ "aabbaa" | replace_last: "aa", "XX" }}', output: 'aabbXX', desc: 'Replaces only the last occurrence of the search string.' },
      { name: 'remove', syntax: 'string | remove: "substring"', example: '{{ "hello world" | remove: "o" }}', output: 'hell wrld', desc: 'Removes every occurrence of the specified substring.' },
      { name: 'remove_first', syntax: 'string | remove_first: "substring"', example: '{{ "hello world" | remove_first: "o" }}', output: 'hell world', desc: 'Removes only the first occurrence of the specified substring.' },
      { name: 'remove_last', syntax: 'string | remove_last: "substring"', example: '{{ "hello world" | remove_last: "o" }}', output: 'hello wrld', desc: 'Removes only the last occurrence of the specified substring.' },
      { name: 'append', syntax: 'string | append: "suffix"', example: '{{ "Hello" | append: " World" }}', output: 'Hello World', desc: 'Appends a string to the end of the input.' },
      { name: 'prepend', syntax: 'string | prepend: "prefix"', example: '{{ "World" | prepend: "Hello " }}', output: 'Hello World', desc: 'Prepends a string to the beginning of the input.' },
      { name: 'slice', syntax: 'string | slice: index[, length]', example: '{{ "Hello" | slice: 1, 3 }}', output: 'ell', desc: 'Returns a substring starting at the given index. The second argument sets the length.' },
      { name: 'truncate', syntax: 'string | truncate: length[, "ellipsis"]', example: '{{ "Hello World" | truncate: 8 }}', output: 'Hello...', desc: 'Shortens a string to the given number of characters and appends an ellipsis.' },
      { name: 'truncatewords', syntax: 'string | truncatewords: words[, "ellipsis"]', example: '{{ "Hello big world" | truncatewords: 2 }}', output: 'Hello big...', desc: 'Shortens a string to the given number of words and appends an ellipsis.' },
      { name: 'escape', syntax: 'string | escape', example: '{{ "<b>Hi</b>" | escape }}', output: '&lt;b&gt;Hi&lt;/b&gt;', desc: 'Escapes HTML special characters (< > & " \') as HTML entities.' },
      { name: 'escape_once', syntax: 'string | escape_once', example: '{{ "&lt;b&gt;" | escape_once }}', output: '&lt;b&gt;', desc: 'Escapes a string only if it has not already been escaped — prevents double-escaping.' },
      { name: 'url_encode', syntax: 'string | url_encode', example: '{{ "hello world" | url_encode }}', output: 'hello+world', desc: 'Encodes special characters in a string to be safe in a URL query string.' },
      { name: 'url_decode', syntax: 'string | url_decode', example: '{{ "hello+world" | url_decode }}', output: 'hello world', desc: 'Decodes a URL-encoded string back to readable text.' },
      { name: 'base64_encode', syntax: 'string | base64_encode', example: '{{ "hello" | base64_encode }}', output: 'aGVsbG8=', desc: 'Encodes a string to Base64 format.' },
      { name: 'base64_decode', syntax: 'string | base64_decode', example: '{{ "aGVsbG8=" | base64_decode }}', output: 'hello', desc: 'Decodes a Base64-encoded string.' },
      { name: 'md5', syntax: 'string | md5', example: '{{ "hello" | md5 }}', output: '5d41402abc4b2a76b9719d911017c592', desc: 'Returns an MD5 hash of the string. Useful for Gravatar URLs.' },
      { name: 'sha1', syntax: 'string | sha1', example: '{{ "hello" | sha1 }}', output: 'aaf4c61d...', desc: 'Returns a SHA-1 hash of the string.' },
      { name: 'sha256', syntax: 'string | sha256', example: '{{ "hello" | sha256 }}', output: '2cf24dba...', desc: 'Returns a SHA-256 hash of the string.' },
      { name: 'hmac_sha1', syntax: 'string | hmac_sha1: "secret"', example: '{{ "hello" | hmac_sha1: "secret" }}', output: 'HMAC hash', desc: 'Returns an HMAC-SHA1 hash of the string using the given secret key.' },
      { name: 'hmac_sha256', syntax: 'string | hmac_sha256: "secret"', example: '{{ "hello" | hmac_sha256: "secret" }}', output: 'HMAC hash', desc: 'Returns an HMAC-SHA256 hash of the string using the given secret key.' },
      { name: 'handleize', syntax: 'string | handleize', example: '{{ "Hello World!" | handleize }}', output: 'hello-world', desc: 'Converts a string to a URL-safe handle — lowercased, spaces to hyphens, special characters removed.' },
    ],
  },
  {
    category: 'Array',
    color: 'green',
    filters: [
      { name: 'join', syntax: 'array | join: "delimiter"', example: '{{ arr | join: ", " }}', output: 'a, b, c', desc: 'Joins array elements into a string with the given delimiter.' },
      { name: 'first', syntax: 'array | first', example: '{{ arr | first }}', output: 'a', desc: 'Returns the first element of an array.' },
      { name: 'last', syntax: 'array | last', example: '{{ arr | last }}', output: 'c', desc: 'Returns the last element of an array.' },
      { name: 'size', syntax: 'array | size', example: '{{ arr | size }}', output: '3', desc: 'Returns the number of elements in an array, or characters in a string.' },
      { name: 'concat', syntax: 'array | concat: array2', example: '{{ a | concat: b }}', output: '[1,2,3,4]', desc: 'Merges two arrays into one without removing duplicates.' },
      { name: 'push', syntax: 'array | push: element', example: '{{ arr | push: "d" }}', output: '[a,b,c,d]', desc: 'Appends an element to the end of an array.' },
      { name: 'pop', syntax: 'array | pop', example: '{{ arr | pop }}', output: '[a,b]', desc: 'Removes and returns the last element of an array.' },
      { name: 'shift', syntax: 'array | shift', example: '{{ arr | shift }}', output: '[b,c]', desc: 'Removes and returns the first element of an array.' },
      { name: 'unshift', syntax: 'array | unshift: element', example: '{{ arr | unshift: "z" }}', output: '[z,a,b,c]', desc: 'Prepends an element to the beginning of an array.' },
      { name: 'map', syntax: 'array | map: "property"', example: '{{ products | map: "title" }}', output: '["Shirt","Hat"]', desc: 'Creates a new array by extracting the named property from each object.' },
      { name: 'where', syntax: 'array | where: "prop", value', example: '{{ products | where: "available", true }}', output: 'filtered array', desc: 'Filters an array to items where the specified property equals the given value.' },
      { name: 'reject', syntax: 'array | reject: "prop", value', example: '{{ products | reject: "available", false }}', output: 'filtered array', desc: 'Opposite of where — keeps items where the property does NOT equal the value.' },
      { name: 'select', syntax: 'array | select: "property"', example: '{{ products | select: "title" }}', output: 'array of values', desc: 'Returns an array of values for a property across objects — similar to map.' },
      { name: 'find', syntax: 'array | find: "prop", value', example: '{{ products | find: "handle", "shirt" }}', output: 'first match', desc: 'Returns the first object in the array where the property equals the value.' },
      { name: 'uniq', syntax: 'array | uniq', example: '{{ arr | uniq }}', output: '[1,2,3]', desc: 'Removes duplicate elements from an array.' },
      { name: 'sort', syntax: 'array | sort[: "property"]', example: '{{ arr | sort }}', output: '[1,2,3]', desc: 'Sorts an array in ascending order. Pass a property name to sort an array of objects.' },
      { name: 'sort_natural', syntax: 'array | sort_natural[: "property"]', example: '{{ arr | sort_natural }}', output: 'case-insensitive sort', desc: 'Sorts an array in case-insensitive alphabetical order.' },
      { name: 'reverse', syntax: 'array | reverse', example: '{{ arr | reverse }}', output: '[c,b,a]', desc: 'Reverses the order of items in an array.' },
      { name: 'flatten', syntax: 'array | flatten[: depth]', example: '{{ nested | flatten }}', output: 'flat array', desc: 'Flattens a nested array. Optional depth argument limits how many levels are flattened.' },
      { name: 'compact', syntax: 'array | compact', example: '{{ arr | compact }}', output: 'no nil values', desc: 'Removes all nil (empty) values from an array.' },
      { name: 'sum', syntax: 'array | sum[: "property"]', example: '{{ prices | sum }}', output: '30', desc: 'Returns the sum of all elements. Pass a property name to sum across objects.' },
      { name: 'includes', syntax: 'array | includes: value', example: '{{ arr | includes: "red" }}', output: 'true or false', desc: 'Returns true if the array contains the given value.' },
    ],
  },
  {
    category: 'Math',
    color: 'purple',
    filters: [
      { name: 'abs', syntax: 'number | abs', example: '{{ -5 | abs }}', output: '5', desc: 'Returns the absolute (positive) value of a number.' },
      { name: 'ceil', syntax: 'number | ceil', example: '{{ 4.2 | ceil }}', output: '5', desc: 'Rounds a number up to the nearest integer.' },
      { name: 'floor', syntax: 'number | floor', example: '{{ 4.8 | floor }}', output: '4', desc: 'Rounds a number down to the nearest integer.' },
      { name: 'round', syntax: 'number | round[: precision]', example: '{{ 4.567 | round: 2 }}', output: '4.57', desc: 'Rounds to the nearest integer, or to the specified decimal places.' },
      { name: 'plus', syntax: 'number | plus: amount', example: '{{ 10 | plus: 3 }}', output: '13', desc: 'Adds a number to the input.' },
      { name: 'minus', syntax: 'number | minus: amount', example: '{{ 10 | minus: 3 }}', output: '7', desc: 'Subtracts a number from the input.' },
      { name: 'times', syntax: 'number | times: factor', example: '{{ 5 | times: 3 }}', output: '15', desc: 'Multiplies the input by a number.' },
      { name: 'divided_by', syntax: 'number | divided_by: divisor', example: '{{ 10 | divided_by: 2 }}', output: '5', desc: 'Divides the input by a number. Uses integer division when both values are integers.' },
      { name: 'modulo', syntax: 'number | modulo: divisor', example: '{{ 10 | modulo: 3 }}', output: '1', desc: 'Returns the remainder after dividing by the divisor.' },
      { name: 'at_most', syntax: 'number | at_most: max', example: '{{ 10 | at_most: 5 }}', output: '5', desc: 'Returns the smaller of the input and the given maximum.' },
      { name: 'at_least', syntax: 'number | at_least: min', example: '{{ 2 | at_least: 5 }}', output: '5', desc: 'Returns the larger of the input and the given minimum.' },
    ],
  },
  {
    category: 'Money',
    color: 'yellow',
    filters: [
      { name: 'money', syntax: 'cents | money', example: '{{ product.price | money }}', output: '$10.00', desc: "Formats a price (in cents) using the shop's currency and locale format." },
      { name: 'money_with_currency', syntax: 'cents | money_with_currency', example: '{{ product.price | money_with_currency }}', output: '$10.00 USD', desc: 'Formats a price as money and appends the currency code.' },
      { name: 'money_without_trailing_zeros', syntax: 'cents | money_without_trailing_zeros', example: '{{ product.price | money_without_trailing_zeros }}', output: '$10', desc: 'Formats as money but hides the decimal part when it is zero.' },
      { name: 'money_without_currency', syntax: 'cents | money_without_currency', example: '{{ product.price | money_without_currency }}', output: '10.00', desc: 'Formats as money but omits the currency symbol.' },
      { name: 'weight', syntax: 'grams | weight', example: '{{ variant.weight | weight }}', output: '1.0', desc: "Converts a weight from grams to the shop's configured weight unit." },
      { name: 'weight_with_unit', syntax: 'grams | weight_with_unit', example: '{{ variant.weight | weight_with_unit }}', output: '1.0 kg', desc: "Converts a weight from grams and appends the shop's weight unit label." },
    ],
  },
  {
    category: 'Date',
    color: 'orange',
    filters: [
      { name: 'date', syntax: 'timestamp | date: "format"', example: '{{ article.created_at | date: "%B %d, %Y" }}', output: 'January 01, 2024', desc: 'Formats a timestamp using strftime codes. Common codes: %Y (year), %m (month), %d (day), %H:%M (time). Use "now" for the current time. Pass "%s" to get a Unix timestamp.' },
    ],
  },
  {
    category: 'URL & Asset',
    color: 'teal',
    filters: [
      { name: 'image_url', syntax: 'image | image_url: width: n', example: '{{ product.featured_image | image_url: width: 500 }}', output: 'CDN URL (500px wide)', desc: 'Modern CDN URL filter. Generates a sized image URL. Supports width, height, crop, and format parameters.' },
      { name: 'img_url', syntax: 'image | img_url: "size"', example: '{{ product.featured_image | img_url: "300x300" }}', output: 'CDN URL', desc: 'Legacy image URL filter. Returns an image resized to the given size string. Prefer image_url for new themes.' },
      { name: 'asset_url', syntax: '"filename" | asset_url', example: '{{ "style.css" | asset_url }}', output: 'https://cdn.shopify.com/.../style.css', desc: "Returns the CDN URL of a file in the theme's /assets/ folder." },
      { name: 'asset_img_url', syntax: '"filename" | asset_img_url: "size"', example: '{{ "logo.png" | asset_img_url: "200x" }}', output: 'CDN URL', desc: "Returns a resized CDN URL of an image in the theme's /assets/ folder." },
      { name: 'file_url', syntax: '"filename" | file_url', example: '{{ "brochure.pdf" | file_url }}', output: 'CDN URL', desc: 'Returns the CDN URL of a file uploaded via the Files section of Shopify admin.' },
      { name: 'file_img_url', syntax: '"filename" | file_img_url: "size"', example: '{{ "image.jpg" | file_img_url: "100x100" }}', output: 'CDN URL', desc: 'Returns a resized CDN URL of an image from the Files section.' },
      { name: 'link_to', syntax: '"text" | link_to: "url"[, "title"]', example: '{{ "Click here" | link_to: product.url }}', output: '<a href="...">Click here</a>', desc: 'Wraps the string in an HTML <a> tag pointing to the given URL.' },
      { name: 'within', syntax: 'product | within: collection', example: '{{ product | within: collection }}', output: '/collections/sale/products/shirt', desc: 'Returns the URL of a product scoped within a specific collection.' },
      { name: 'url_for_type', syntax: '"type" | url_for_type', example: '{{ "products" | url_for_type }}', output: '/collections/all', desc: 'Returns the URL for a Shopify resource type like products or blogs.' },
    ],
  },
  {
    category: 'HTML',
    color: 'pink',
    filters: [
      { name: 'img_tag', syntax: 'image | img_tag[: "alt", "class"]', example: '{{ product.featured_image | img_tag }}', output: '<img src="..."/>', desc: 'Generates an <img> tag. Pass alt text and a CSS class as optional arguments.' },
      { name: 'image_tag', syntax: 'image_url | image_tag', example: '{{ product.featured_image | image_url: width: 300 | image_tag }}', output: '<img src="..."/>', desc: 'Generates an <img> tag from a URL produced by image_url. The modern replacement for img_tag.' },
      { name: 'stylesheet_tag', syntax: '"url" | stylesheet_tag', example: '{{ "style.css" | asset_url | stylesheet_tag }}', output: '<link rel="stylesheet" href="..."/>', desc: 'Wraps a URL in an HTML <link rel="stylesheet"> tag.' },
      { name: 'script_tag', syntax: '"url" | script_tag', example: '{{ "app.js" | asset_url | script_tag }}', output: '<script src="..."></script>', desc: 'Wraps a URL in an HTML <script> tag.' },
      { name: 'time_tag', syntax: 'timestamp | time_tag[: "format"]', example: '{{ article.created_at | time_tag }}', output: '<time datetime="...">Jan 01</time>', desc: 'Returns an HTML <time> tag with a machine-readable datetime attribute.' },
      { name: 'highlight', syntax: 'string | highlight: "terms"', example: '{{ result.title | highlight: search.terms }}', output: '<strong class="highlight">...</strong>', desc: 'Wraps matching search terms in <strong class="highlight"> tags.' },
      { name: 'placeholder_svg_tag', syntax: '"type" | placeholder_svg_tag', example: '{{ "product-1" | placeholder_svg_tag }}', output: '<svg>...</svg>', desc: 'Returns a placeholder SVG element for use when no image is set on a product or collection.' },
    ],
  },
  {
    category: 'Color',
    color: 'red',
    filters: [
      { name: 'color_to_rgb', syntax: 'color | color_to_rgb', example: '{{ "#ff6600" | color_to_rgb }}', output: 'rgb(255, 102, 0)', desc: 'Converts a CSS color (hex, hsl, named) to rgb() format.' },
      { name: 'color_to_hsl', syntax: 'color | color_to_hsl', example: '{{ "#ff6600" | color_to_hsl }}', output: 'hsl(24, 100%, 50%)', desc: 'Converts a CSS color to hsl() format.' },
      { name: 'color_to_hex', syntax: 'color | color_to_hex', example: '{{ "rgb(255,102,0)" | color_to_hex }}', output: '#ff6600', desc: 'Converts a CSS color to hex format.' },
      { name: 'color_extract', syntax: 'color | color_extract: "channel"', example: '{{ "#ff6600" | color_extract: "red" }}', output: '255', desc: 'Extracts a specific channel value from a color (red, green, blue, hue, saturation, lightness, alpha).' },
      { name: 'color_modify', syntax: 'color | color_modify: "channel", value', example: '{{ "#ff6600" | color_modify: "alpha", 0.5 }}', output: 'rgba(255,102,0,0.5)', desc: 'Sets a specific channel of a color to the given value.' },
      { name: 'color_lighten', syntax: 'color | color_lighten: percent', example: '{{ "#ff6600" | color_lighten: 20 }}', output: '#ff9947', desc: 'Lightens a color by the given percentage (0–100).' },
      { name: 'color_darken', syntax: 'color | color_darken: percent', example: '{{ "#ff6600" | color_darken: 20 }}', output: '#cc5200', desc: 'Darkens a color by the given percentage (0–100).' },
      { name: 'color_saturate', syntax: 'color | color_saturate: percent', example: '{{ "#ff6600" | color_saturate: 10 }}', output: 'more vivid color', desc: 'Increases the saturation of a color by the given percentage.' },
      { name: 'color_desaturate', syntax: 'color | color_desaturate: percent', example: '{{ "#ff6600" | color_desaturate: 10 }}', output: 'less vivid color', desc: 'Decreases the saturation of a color by the given percentage.' },
      { name: 'color_mix', syntax: 'color1 | color_mix: color2, percent', example: '{{ "#ff0000" | color_mix: "#0000ff", 50 }}', output: '#7f007f', desc: 'Blends two colors. The percent is the weight of the second color (0 = all color1, 100 = all color2).' },
      { name: 'color_brightness', syntax: 'color | color_brightness', example: '{{ "#ffffff" | color_brightness }}', output: '255', desc: 'Returns the perceived brightness of a color as a value from 0 to 255.' },
      { name: 'color_difference', syntax: 'color1 | color_difference: color2', example: '{{ "#ffffff" | color_difference: "#000000" }}', output: '765', desc: 'Returns a numeric difference between two colors. Used to check visual contrast.' },
      { name: 'brightness_difference', syntax: 'color1 | brightness_difference: color2', example: '{{ "#fff" | brightness_difference: "#000" }}', output: '255', desc: 'Returns the absolute brightness difference between two colors.' },
      { name: 'contrast_ratio', syntax: 'color1 | contrast_ratio: color2', example: '{{ "#fff" | contrast_ratio: "#000" }}', output: '21', desc: 'Returns the WCAG contrast ratio between two colors. Values ≥ 4.5 meet AA accessibility standards.' },
    ],
  },
  {
    category: 'Utility',
    color: 'gray',
    filters: [
      { name: 'default', syntax: 'variable | default: fallback', example: '{{ product.compare_at_price | default: 0 }}', output: '0 (when nil)', desc: 'Returns a fallback value when the variable is nil, false, or an empty string. Add allow_false: true to treat false as a valid non-empty value.' },
      { name: 'json', syntax: 'variable | json', example: '{{ product | json }}', output: '{"title":"Shirt",...}', desc: 'Serialises a Liquid object to a JSON string. Useful for passing Shopify data to JavaScript.' },
      { name: 't', syntax: '"key" | t', example: '{{ "products.product.add_to_cart" | t }}', output: 'Add to cart', desc: "Translates a locale key using the shop's active language file. Pass variables as keyword arguments." },
      { name: 'format_address', syntax: 'address | format_address', example: '{{ shop.address | format_address }}', output: 'Formatted HTML address', desc: "Generates an HTML-formatted address block using the locale's address format." },
      { name: 'camelize', syntax: 'string | camelize', example: '{{ "hello_world" | camelize }}', output: 'HelloWorld', desc: 'Converts a string to PascalCase (UpperCamelCase) by capitalising each word.' },
    ],
  },
]

const TAG_GROUPS = [
  {
    category: 'Variable',
    color: 'blue',
    tags: [
      { name: 'assign', syntax: '{% assign var = value %}', example: '{% assign greeting = "Hello" %}\n{{ greeting }}', desc: 'Creates a new variable or overwrites an existing one. Available throughout the template.' },
      { name: 'capture', syntax: '{% capture var %}…{% endcapture %}', example: '{% capture msg %}\n  Hello {{ name }}\n{% endcapture %}\n{{ msg }}', desc: 'Captures rendered output (including other tags) into a variable as a string.' },
      { name: 'increment', syntax: '{% increment var %}', example: '{% increment counter %}\n{% increment counter %}', desc: 'Outputs and increments a counter starting at 0. Independent of variables created by assign.' },
      { name: 'decrement', syntax: '{% decrement var %}', example: '{% decrement counter %}', desc: 'Outputs and decrements a counter starting at -1. Independent of assign variables.' },
    ],
  },
  {
    category: 'Control Flow',
    color: 'green',
    tags: [
      { name: 'if', syntax: '{% if condition %}…{% endif %}', example: '{% if product.available %}\n  In stock\n{% endif %}', desc: 'Renders the block only when the condition is truthy. Combine with elsif and else for branches.' },
      { name: 'unless', syntax: '{% unless condition %}…{% endunless %}', example: '{% unless product.available %}\n  Sold out\n{% endunless %}', desc: 'Opposite of if — renders the block only when the condition is falsy.' },
      { name: 'elsif', syntax: '{% elsif condition %}', example: '{% if x == 1 %}\n  One\n{% elsif x == 2 %}\n  Two\n{% else %}\n  Other\n{% endif %}', desc: 'Adds an additional condition branch inside an if block. Can appear multiple times.' },
      { name: 'else', syntax: '{% else %}', example: '{% if product.available %}\n  Buy now\n{% else %}\n  Sold out\n{% endif %}', desc: 'Fallback block rendered when all if/elsif conditions are false.' },
      { name: 'case / when', syntax: '{% case var %}\n{% when value %}…{% endcase %}', example: '{% case handle %}\n{% when "index" %}\n  Home\n{% when "contact" %}\n  Contact\n{% else %}\n  Other\n{% endcase %}', desc: 'Evaluates a variable and runs the matching when block. Use else for a fallback.' },
    ],
  },
  {
    category: 'Iteration',
    color: 'purple',
    tags: [
      { name: 'for', syntax: '{% for item in array %}…{% endfor %}', example: '{% for product in collection.products %}\n  {{ product.title }}\n{% endfor %}', desc: 'Iterates over an array. The forloop object provides index, first, last, length, and rindex.' },
      { name: 'break', syntax: '{% break %}', example: '{% for i in (1..5) %}\n  {% if i == 3 %}{% break %}{% endif %}\n  {{ i }}\n{% endfor %}', desc: 'Immediately exits the current for loop.' },
      { name: 'continue', syntax: '{% continue %}', example: '{% for i in (1..5) %}\n  {% if i == 3 %}{% continue %}{% endif %}\n  {{ i }}\n{% endfor %}', desc: 'Skips the current iteration and moves to the next item.' },
      { name: 'limit', syntax: '{% for item in array limit: n %}', example: '{% for product in collection.products limit: 4 %}', desc: 'Limits the for loop to n iterations.' },
      { name: 'offset', syntax: '{% for item in array offset: n %}', example: '{% for product in collection.products offset: 2 %}', desc: 'Starts the for loop at item n (zero-indexed). Use offset: continue to resume from where the last loop ended.' },
      { name: 'reversed', syntax: '{% for item in array reversed %}', example: '{% for product in collection.products reversed %}', desc: 'Iterates over the array in reverse order.' },
      { name: 'range', syntax: '(start..end)', example: '{% for i in (1..5) %}\n  {{ i }}\n{% endfor %}', desc: 'Creates a numeric range to iterate over. start and end can be integers or variables.' },
      { name: 'cycle', syntax: '{% cycle "a", "b", "c" %}', example: '{% for product in collection.products %}\n  {% cycle "odd", "even" %}\n{% endfor %}', desc: 'Cycles through a list of strings on each iteration. Useful for alternating row styles.' },
      { name: 'tablerow', syntax: '{% tablerow item in array cols: n %}…{% endtablerow %}', example: '{% tablerow product in collection.products cols: 3 %}\n  {{ product.title }}\n{% endtablerow %}', desc: 'Generates <tr> and <td> tags for each item. The cols parameter sets how many columns before wrapping.' },
    ],
  },
  {
    category: 'Theme',
    color: 'orange',
    tags: [
      { name: 'render', syntax: '{% render "snippet" %}', example: '{% render "product-card", product: product %}', desc: 'Renders a file from /snippets/. Variables must be explicitly passed — the snippet does not inherit parent scope. Preferred over include.' },
      { name: 'include', syntax: '{% include "snippet" %}', example: '{% include "product-card" %}', desc: 'Renders a snippet and shares all parent template variables. Deprecated — use render.' },
      { name: 'section', syntax: '{% section "name" %}', example: '{% section "header" %}', desc: 'Renders a section file from /sections/. Sections have their own settings defined by {% schema %}.' },
      { name: 'layout', syntax: '{% layout "name" %}', example: '{% layout "checkout" %}', desc: 'Specifies which layout file to wrap this template in. Use {% layout none %} to skip all layouts.' },
      { name: 'content_for_header', syntax: '{{ content_for_header }}', example: '{{ content_for_header }}', desc: 'Outputs Shopify-required scripts and metadata inside <head>. Required in every layout file.' },
      { name: 'content_for_layout', syntax: '{{ content_for_layout }}', example: '{{ content_for_layout }}', desc: 'Outputs the rendered template content inside the layout. Required in every layout file.' },
    ],
  },
  {
    category: 'Output',
    color: 'teal',
    tags: [
      { name: 'comment', syntax: '{% comment %}…{% endcomment %}', example: '{% comment %}\n  Hidden from output\n{% endcomment %}', desc: 'Anything inside is ignored and not rendered. Use for developer notes or temporarily disabling code.' },
      { name: 'raw', syntax: '{% raw %}…{% endraw %}', example: '{% raw %}\n  {{ not processed }}\n{% endraw %}', desc: 'Disables Liquid processing inside the block — useful for outputting Liquid-like syntax in docs or code examples.' },
      { name: 'echo', syntax: '{% echo variable %}', example: '{% echo product.title %}', desc: 'Outputs a variable — equivalent to {{ variable }} but usable inside a {% liquid %} block.' },
      { name: 'liquid', syntax: '{% liquid\n  statement\n  statement\n%}', example: '{% liquid\n  assign total = 0\n  for item in cart.items\n    assign total = total | plus: item.line_price\n  endfor\n  echo total | money\n%}', desc: 'Allows multiple Liquid statements inside a single tag block without per-line {% %} delimiters.' },
    ],
  },
  {
    category: 'Pagination',
    color: 'yellow',
    tags: [
      { name: 'paginate', syntax: '{% paginate array by n %}…{% endpaginate %}', example: '{% paginate collection.products by 12 %}\n  {% for product in collection.products %}\n    {{ product.title }}\n  {% endfor %}\n  {{ paginate | default_pagination }}\n{% endpaginate %}', desc: 'Splits an array across multiple pages. The paginate object provides page, pages, current_offset, and helpers like default_pagination.' },
    ],
  },
  {
    category: 'Form',
    color: 'pink',
    tags: [
      { name: 'form', syntax: '{% form "type"[, object] %}…{% endform %}', example: '{% form "product", product %}\n  {{ form.errors | default_errors }}\n  <button type="submit">Add to cart</button>\n{% endform %}', desc: 'Generates an HTML <form> with the correct action, method, and authenticity token. Form types include: product, contact, customer, customer_login, recover_customer_password, create_customer, guest_login, address.' },
    ],
  },
  {
    category: 'Schema',
    color: 'gray',
    tags: [
      { name: 'schema', syntax: '{% schema %}…{% endschema %}', example: '{% schema %}\n{\n  "name": "My Section",\n  "settings": [\n    { "type": "text", "id": "heading", "label": "Heading" }\n  ]\n}\n{% endschema %}', desc: 'Defines section settings and blocks as JSON. Must appear once per section file. Not rendered in HTML output.' },
      { name: 'javascript', syntax: '{% javascript %}…{% endjavascript %}', example: '{% javascript %}\n  document.addEventListener("DOMContentLoaded", () => {\n    console.log("Section loaded");\n  });\n{% endjavascript %}', desc: "Defines section-specific JavaScript. Shopify bundles it with the theme's JS. Not rendered inline." },
      { name: 'stylesheet', syntax: '{% stylesheet %}…{% endstylesheet %}', example: '{% stylesheet %}\n  .my-section { color: red; }\n{% endstylesheet %}', desc: "Defines section-specific CSS. Shopify bundles it with the theme's CSS. Not rendered inline." },
    ],
  },
]

const COLOR_CLASSES = {
  blue:   { badge: 'bg-blue-500/10 text-blue-400',     heading: 'text-blue-400',    border: 'border-blue-500/20' },
  green:  { badge: 'bg-green-500/10 text-green-400',   heading: 'text-green-400',   border: 'border-green-500/20' },
  purple: { badge: 'bg-purple-500/10 text-purple-400', heading: 'text-purple-400',  border: 'border-purple-500/20' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400', heading: 'text-yellow-400',  border: 'border-yellow-500/20' },
  orange: { badge: 'bg-orange-500/10 text-orange-400', heading: 'text-orange-400',  border: 'border-orange-500/20' },
  teal:   { badge: 'bg-teal-500/10 text-teal-400',     heading: 'text-teal-400',    border: 'border-teal-500/20' },
  pink:   { badge: 'bg-pink-500/10 text-pink-400',     heading: 'text-pink-400',    border: 'border-pink-500/20' },
  red:    { badge: 'bg-red-500/10 text-red-400',       heading: 'text-red-400',     border: 'border-red-500/20' },
  gray:   { badge: 'bg-zinc-500/10 text-zinc-400',     heading: 'text-zinc-400',    border: 'border-zinc-500/20' },
}

export default function LiquidFilterReference() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('filters')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    document.title = 'Shopify Liquid Filter & Tag Reference | OmniverseTools'
  }, [])

  const q = query.trim().toLowerCase()

  const filteredFilters = FILTER_GROUPS.map(g => ({
    ...g,
    filters: q
      ? g.filters.filter(f =>
          f.name.toLowerCase().includes(q) ||
          f.desc.toLowerCase().includes(q) ||
          f.syntax.toLowerCase().includes(q) ||
          f.example.toLowerCase().includes(q)
        )
      : g.filters,
  })).filter(g => g.filters.length > 0)

  const filteredTags = TAG_GROUPS.map(g => ({
    ...g,
    tags: q
      ? g.tags.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.syntax.toLowerCase().includes(q) ||
          t.example.toLowerCase().includes(q)
        )
      : g.tags,
  })).filter(g => g.tags.length > 0)

  const activeGroups = tab === 'filters' ? filteredFilters : filteredTags
  const isEmpty = activeGroups.length === 0

  const toggleExpand = key => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const totalFilters = FILTER_GROUPS.reduce((n, g) => n + g.filters.length, 0)
  const totalTags = TAG_GROUPS.reduce((n, g) => n + g.tags.length, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Shopify Liquid Filter &amp; Tag Reference</h1>
      <p className="text-gray-400 mb-6">
        Searchable cheatsheet for all Shopify Liquid filters and tags — with syntax, examples, and plain-English descriptions. {totalFilters} filters · {totalTags} tags.
      </p>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search filters, tags, or descriptions…"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'filters', label: `Filters (${totalFilters})` },
          { key: 'tags',    label: `Tags (${totalTags})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category summary chips */}
      {!q && (
        <div className="flex flex-wrap gap-2 mb-8">
          {activeGroups.map(g => {
            const cls = COLOR_CLASSES[g.color]
            const count = g.filters ? g.filters.length : g.tags.length
            return (
              <span key={g.category} className={`text-xs px-3 py-1.5 rounded-full border ${cls.badge} ${cls.border}`}>
                {g.category} ({count})
              </span>
            )
          })}
        </div>
      )}

      {/* Results */}
      {isEmpty ? (
        <p className="text-gray-500 text-sm">No results for &ldquo;{query}&rdquo;.</p>
      ) : tab === 'filters' ? (
        <div className="space-y-10">
          {filteredFilters.map(({ category, color, filters }) => {
            const cls = COLOR_CLASSES[color]
            return (
              <section key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-lg font-bold ${cls.heading}`}>{category}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-zinc-800 px-2.5 py-1 rounded-full">
                    {filters.length} filter{filters.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {filters.map(f => {
                    const key = `f-${category}-${f.name}`
                    const open = expanded[key]
                    return (
                      <div key={f.name} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                        <button
                          onClick={() => toggleExpand(key)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        >
                          <span className={`font-mono font-semibold text-sm shrink-0 ${cls.heading}`}>{f.name}</span>
                          <span className="text-gray-500 text-xs font-mono truncate flex-1 hidden sm:block">{f.syntax}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${cls.badge}`}>{category}</span>
                          <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {open && (
                          <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                            <p className="text-gray-300 text-sm">{f.desc}</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Syntax</div>
                                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-orange-300 font-mono whitespace-pre-wrap">{f.syntax}</code>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Example</div>
                                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre-wrap">{f.example}</code>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Output</div>
                              <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-blue-300 font-mono">{f.output}</code>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="space-y-10">
          {filteredTags.map(({ category, color, tags }) => {
            const cls = COLOR_CLASSES[color]
            return (
              <section key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-lg font-bold ${cls.heading}`}>{category}</span>
                  <span className="ml-auto text-xs text-gray-600 bg-zinc-800 px-2.5 py-1 rounded-full">
                    {tags.length} tag{tags.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {tags.map(t => {
                    const key = `t-${category}-${t.name}`
                    const open = expanded[key]
                    return (
                      <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                        <button
                          onClick={() => toggleExpand(key)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        >
                          <span className={`font-mono font-semibold text-sm shrink-0 ${cls.heading}`}>{t.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-auto ${cls.badge}`}>{category}</span>
                          <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {open && (
                          <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                            <p className="text-gray-300 text-sm">{t.desc}</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Syntax</div>
                                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-orange-300 font-mono whitespace-pre-wrap">{t.syntax}</code>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Example</div>
                                <code className="block bg-zinc-800 rounded-lg px-3 py-2 text-xs text-green-300 font-mono whitespace-pre-wrap">{t.example}</code>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className="mt-12 text-sm text-gray-500 leading-relaxed">
        <h2 className="text-gray-300 font-semibold text-base mb-2">About Shopify Liquid</h2>
        <p>
          Liquid is Shopify's open-source template language. It has three types of delimiters:{' '}
          <code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{'{{ }}'}</code> outputs a variable,{' '}
          <code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{'{% %}'}</code> executes logic (tags), and{' '}
          <code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{{'{# #}'}}</code> is a comment (Liquid 5+).
          Filters transform output using the pipe character (<code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">|</code>)
          and can be chained: <code className="text-orange-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{'{{ title | upcase | truncate: 20 }}'}</code>.
        </p>
      </div>
    </div>
  )
}
