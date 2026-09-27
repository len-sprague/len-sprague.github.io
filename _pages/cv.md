---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<div class="cv-download" style="margin-bottom: 1.5em;">
  <a href="{{ base_path }}/files/CV.pdf" class="btn btn--primary" download>Download CV (PDF)</a>
</div>

<div class="cv-viewer" style="margin-bottom: 2em;">
  <iframe src="{{ base_path }}/files/CV.pdf" width="100%" height="800" style="border: 1px solid #ccc;">
    Your browser does not support embedded PDFs. Please use the download link above.
  </iframe>
</div>

Some information from my CV is below (Publications, Talks, Teaching), linked to the relevant pages.

Publications
======
See the full list on the [Publications page]({{ base_path }}/publications/).
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
See the full list on the [Talks page]({{ base_path }}/talks/).
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
Teaching
======
See the full list on the [Teaching page]({{ base_path }}/teaching/).
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
