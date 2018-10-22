# Grreedy Dictionary: Multilanguage Dictionary and Word Collecting App

This is an app to look up etymologies and translations of words and save them in collections to browse, explore and edit.

## Getting Started

This is Django project with data residing in PostgreSQL and served by the Django REST framework, and rendered by a React/Redux-based frontend.
The words are loooked up thru Oxford API when possible (for English language) or fetched via a WordReference.com dictionary. One can look up and accumulate words in an anonymous collection, or, when logged in, it is possible to save collections of words, name and see all of your collections and edit personal notes on individual words.

