### Roadmap for Long Term Support

This roadmap can be complemented by the issues in Github repo as well.

#### Form and User Inputs

- Application Status Link Form
    - [ ] Frontend Dynamic Form [#19](https://github.com/rivernews/appl-tracky-spa/issues/19)
        - Create form: temporarily providing only one link for status. However, ultimate goal will be making this dynamic w/ dynamic field form.
        - Update form: adapt for dynamic field form. 
    - Backend
        - CRUD operation: done.
        - [ ] Refactor create/update: needs to use more REST's serializer methods instead of accessing instances manually. [#25](https://github.com/rivernews/appl-tracky-spa/issues/25)
- General Form
    - [ ] Flexible url input - deal with anchor `href`. Probably has to write a data model class.[#23](https://github.com/rivernews/appl-tracky-spa/issues/23)
    - [ ] Form validation [#22](https://github.com/rivernews/appl-tracky-spa/issues/22) - single source of truth - for both backend and frontend.
    - [ ] Providing more fields in form, referring to backend data model. [#5](https://github.com/rivernews/appl-tracky-spa/issues/5)
    - [ ] Optional / required fields review for convenience. [#17](https://github.com/rivernews/appl-tracky-spa/issues/17)
- User Requests
    - More input types for application (perhaps for company, ... also). [#21](https://github.com/rivernews/appl-tracky-spa/issues/21)
- Backend CRUD refactoring
    - One to Many logic generalization. Useful for adding `label` feature. [#13](https://github.com/rivernews/appl-tracky-spa/issues/13)

#### UI Development

- [#7](https://github.com/rivernews/appl-tracky-spa/issues/7), needs planning and break down.
- [#6](https://github.com/rivernews/appl-tracky-spa/issues/7) Tab - need to decide how tabs come from.