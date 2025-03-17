---
layout: layout.html
pageTitle: Contact the Developer
navTitle: Contact the Developer
pageClass: contact
tags:
    - page
    - nav
---

## About the Developer
My name is Amanda Li. I am a native New Yorker, currently living in Brooklyn.

I currently work for NYU IT as a data analyst. Before that I worked for NYU's Office of Institutional Research for five years.

Here are some things I do at work:

- Query databases using SQL.
- Transform data using Python.
- Web updates using a content management system.

Her are some things I do for fun:
- Play claw machine games.
- Collect blind box figures.
- Explore good eats.

Connect with Me:
- [LinkedIn](https://www.linkedin.com/in/liamanda32/)
- [GitHub](https://github.com/al3258)

Contact Me using this <a href="#" id="contactLink">form</a>

<div class="popover" id="contactPopover">
    {% include "contact.html" %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const contactLink = document.getElementById('contactLink');
  const contactPopover = document.getElementById('contactPopover');

  if (contactLink && contactPopover) {
      contactPopover.style.display = 'none'; // Ensure popover is initially hidden

      contactLink.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default link behavior
          contactPopover.style.display = (contactPopover.style.display === 'block') ? 'none' : 'block';
      });

      document.addEventListener('click', function(event) {
          if (contactPopover.style.display === 'block' &&
              !contactPopover.contains(event.target) &&
              event.target !== contactLink) {
              contactPopover.style.display = 'none';
          }
      });
  }
});
</script>

[Back](/) to Random Pokémon Generator