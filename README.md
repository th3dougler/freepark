# Freepark (working title)

## Planning:

[Lucidchart ERD](https://lucid.app/lucidchart/invitations/accept/d5c0ab0b-62fe-4146-b6e5-7234f17b2892?viewport_loc=-271%2C-168%2C2219%2C1079%2C0_0)





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


