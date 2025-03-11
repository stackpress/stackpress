export type Link = { 
  href: string, 
  type: string, 
  name: string 
};

//--------------------------------------------------------------------//
// Form Types

export type FormTab = { 
  active: boolean, 
  selector: string, 
  label: string 
};

export type FormField = { 
  zindex: string|null,
  multiple: boolean,
  method: string, 
  label: string, 
  name: string, 
  attributes: string
};

export type FormFieldset = {
  zindex: string|null,
  border: boolean, 
  legend: string, 
  name: string, 
  multiple: boolean, 
  fields: FormFields
};

export type FormFields = { 
  field?: FormField, 
  fieldset?: FormFieldset,
  textarea?: FormField,
}[];

export type FormSection = FormFieldset & {
  selector: string
};

export type FormData = {
  links: Link[],
  tabs: FormTab[],
  fields: FormFields,
  sections: FormSection[]
};

//--------------------------------------------------------------------//
// Filter Types

export type FilterField = {
  zindex: string|null, 
  zindex2: string|null, 
  zindex3: string|null, 
  method: string, 
  label: string, 
  name: string, 
  attributes: string
};
export type FilterFields = { 
  filter?: FilterField, 
  span?: FilterField
}[];

export type FilterData = {
  links: Link[],
  fields: FilterFields
};

//--------------------------------------------------------------------//
// Table Types

export type Format = {
  name: string,
  method: string,
  attributes: string
};
export type None = {
  name: string
};

export type TableFormat = {
  format?: Format, 
  none?: None
};

export type TableData = {
  links: Link[],
  mustache?: boolean,
  headers: {
    head?: { label: string, direction: string },
    sort?: { label: string, direction: string, name: string }
  }[],
  columns: {
    direction: string, 
    column?: TableFormat,
    filter?: TableFormat & { name: string },
    detail?: TableFormat & { href: string }
  }[]
};

//--------------------------------------------------------------------//
// View Types

export type ViewData = {
  links: Link[],
  mustache?: boolean,
  columns: {
    label: string,
    format?: Format, 
    none?: None
  }[]
};