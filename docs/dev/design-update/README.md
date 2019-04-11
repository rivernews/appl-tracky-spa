# Original design

```tsx

<user-app-page />
    <Button add-company />
    <CompanyApplicationComponent />



<add-company-page />

<user-com-app-page />
    <Button add-application />
    <ApplicationForm />
    <CompanyApplicationComponent />

```

```tsx
<CompanyApplicationComponent />
    <CompanyComponent> {/** display */}

    <ApplicationComponent>
    <ApplicationComponent>
    ...

```

```tsx
<ApplicationComponent />
    <ApplicationStatusComponent />
    <Button add-application-status />
    <ApplicationStatusForm />
    
```

---

# Improved design

Improve maintainability, w/o sacrificing performance. We will include form in model component:

```tsx
<ModelComponent />
    <ModelDisplay />
    <Button add-model />
    <ModelForm />

```


```tsx

<user-app-page />
    <Button add-company />
    <CompanyApplicationComponent />

<add-company-page />

<user-com-app-page />
    <CompanyApplicationComponent />

```

```tsx
<CompanyApplicationComponent />
    <CompanyComponent> {/** display */}

    <ApplicationComponent is-form >

    <ApplicationComponent>
    <ApplicationComponent>
    ...

```

```tsx
<ApplicationComponent />
    
    <ApplicationStatusComponent />
    <ApplicationStatusComponent />
    ...

    <ApplicationStatusComponent is-form />
    
```