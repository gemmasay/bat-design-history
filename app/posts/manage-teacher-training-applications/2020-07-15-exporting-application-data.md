---
title: Exporting application data
description: Let users export application data as a CSV
date: 2020-07-15
tags:
- MN022
- MN023
---

{{description}}

## User needs

{% from "user-needs/macro.njk" import appUserNeeds %}
{{ appUserNeeds({ items: collections['user-need'] | slugs(tags)}) }}

## How it works

Users can click ‘Export data’ in the top right of the navigation bar.

This takes them to a page where they can export applications as a CSV file.

They can select:

- applications during the current and previous cycle
- all applications or applications that match a particular status
- to include diversity information (if the user has permission to see this information)
- applications for certain organisations (if the user belongs to multiple organisations)

{% from "screenshots/macro.njk" import appScreenshots with context %}
{{ appScreenshots({
  items: [{
    text: "Navigation link to export",
    img: {
      src: "application-list.png"
    }
  }, {
    text: "Export page",
    img: {
      src: "export-page.png"
    }
  }]
}) }}
