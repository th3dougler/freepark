# Spotter
Spotter is a Django web app that assists users in crowd-sourcing unconventional parking spots in urban areas.

[![](https://i.imgur.com/iwy1c5im.png)](https://imgur.com/iwy1c5i) [![](https://i.imgur.com/whlUbzOm.png)](https://imgur.com/whlUbzO) [![](https://i.imgur.com/It706FCm.png)](https://imgur.com/It706FC)


## Technologies Used:

#### Tech Stack:
[Amazon AWS](https://aws.amazon.com/) - RDS & S3

[Python](https://www.python.org/)

Javascript

[Django](https://www.djangoproject.com/)

[Heroku](https://heroku.com/)

#### Libraries Used:

[LeafletJS](https://leafletjs.com/)

[MaterializeCSS](https://materializecss.com/)

[Material Icons](https://fonts.google.com/icons)

[OpenCage Python Module](https://pypi.org/project/opencage/)

#### API's Used:

[OpenStreetMap] - Raster map tiles

[OpenCage](https://opencagedata.com/) - Geosearch api

## Getting Started:

[A link to the deployed app (Heroku)](https://spotter-demo.herokuapp.com/)

#### Planning Materials:

Trello:
[Trello Board](https://trello.com/b/QExBNmy0/project-3)
ERD:
[Lucidchart ERD](https://lucid.app/lucidchart/invitations/accept/inv_d9ec0432-c70b-4f10-9151-7ce05b54482a)

Wireframes:
[Figma Package](https://www.figma.com/file/ueEUWnLKC6iTLADcuibxoy/Collabathon-Spotter?node-id=71%3A251)
## Planned future enhancements (icebox items).

 - Set timeout feature, for when you can only park for X hours
 - Develop social features
    - Nested comments
    - Friends
    - Share spots between friends
    




## Planning:







## SET UP DEV ENVIRONMENT:
Clone:

```
git clone https://github.com/th3dougler/freepark.git

```



### Requirements:

#### pipenv:
```
pip3 install pipenv
cd freepark
pipenv install

```

#### While working: Any new packages need to be added to the pipenv virtual environment:
```
instead of:
pip3 install xyzpackage

do this:
pipenv install xyzpackage

```




### Branch:

#### Create new branch:
```
git checkout -b branchname

```

#### Work on existing branch:
```
git checkout branchname

```

#### Merge back into main:
```
git checkout main
git merge branchname
git push origin main

```
### [More Branching Stuff](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)


