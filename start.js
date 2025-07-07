// GET REQUEST
function getTodos() {
  console.log('GET Request');
}

// POST REQUEST
function addTodo() {
  console.log('POST Request');
}

// PUT/PATCH REQUEST
function updateTodo() {
  console.log('PUT/PATCH Request');
}

// DELETE REQUEST
function removeTodo() {
  console.log('DELETE Request');
}

// SIMULTANEOUS DATA
function getData() {
  console.log('Simultaneous Request');
}

// CUSTOM HEADERS
function customHeaders() {
  console.log('Custom Headers');
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  console.log('Transform Response');
}

// ERROR HANDLING
function errorHandling() {
  console.log('Error Handling');
}

// CANCEL TOKEN
function cancelToken() {
  console.log('Cancel Token');
}

// INTERCEPTING REQUESTS & RESPONSES

// AXIOS INSTANCES

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);

//##########################################################################################################
function generateManifestSchema(payload, variables) {
  // Build a quick lookup: varName → { type, description }
  const varMap = Object.fromEntries(
    variables.map(v => [v.name, { type: v.type, description: v.description }])
  );

  // Helper: extract all Placeholders from value
  const extractPlaceholders = s => {
    const dynamicValueRegex = /<([^>]+)>/g;
    const dynamicVarialbes = [];
    let x;
    while ((x = dynamicValueRegex.exec(s))) dynamicVarialbes.push(x[1]);
    return dynamicVarialbes;
  };

  // Single recursive function:
  function walk(node, path = '') {
    // Dynamic‑variable metadata for primitives:
    const makeLeafSchema = value => {
      const str = String(value);
      const extractValuePlaceholders = extractPlaceholders(str);
      const matched = extractValuePlaceholders
        .filter(t => varMap[t])
        .map(t => ({ name: t, ...varMap[t] }));

      const isDynamic = matched.length > 0;
      const leafNodeType =
        Array.isArray(value) ? 'array' :
        value === null ? 'null'  :
        typeof value;

      const schema = { type: leafNodeType };

      if (isDynamic) {
        // If multiple dynamic variable, join their descriptions:
        if (matched.length > 1) {
          const description = matched.map(v => v.description).join(', ');
          schema.description = 
            `Use ${description}. For example: "${value}"`;
        } else {
          schema.description = matched[0].description;
        }
      } else {
        schema.default = value;
      }

      // For array‑of‑primitives, define items
      if (Array.isArray(value)) {
        schema.items = { type: typeof value[0] };
      }

      return schema;
    };

    // OBJECT
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const objSchema = { type: 'object', properties: {}, required: [] };
      for (const [k, v] of Object.entries(node)) {
        objSchema.required.push(k);
        objSchema.properties[k] = walk(v, path ? `${path}.${k}` : k);
      }
      return objSchema;
    }

    // ARRAY
    if (Array.isArray(node)) {
      // array of primitives?
      if (node.length > 0 && ['string','number','boolean'].includes(typeof node[0])) {
        return makeLeafSchema(node);
      }
      // array of objects: recurse on first element
      if (node.length > 0 && typeof node[0] === 'object') {
        return {
          type: 'array',
          items: walk(node[0], `${path}[0]`)
        };
      }
      // empty array fallback
      return { type: 'array', items: {} };
    }

    // PRIMITIVE
    return makeLeafSchema(node);
  }

  // Top-level must be an object:
  return walk(payload);
}

const payload = {
  name: "Hello dear <Name><Name>",
  age: 23,
  tags: ["raj","mohit"],
  examples: ["<Example>","<Example1>"],
  hobby: { desc: "<Name> hobby is <Hobby>" },
  books: [{
    name: "<BookName>",
    rating: "<Rating>",
    desc: "<BookName> rating is <Rating>, this book authored by <Name>"
  }]
};

const variables = [
  { name: "Name",    description: "Name of author",    type: "string", example: "Raj"            },
  { name: "Example", description: "Example description",type: "string", example: "Example Value"  },
  { name: "Hobby",   description: "Hobby of author",   type: "string", example: "Listening Music"},
  { name: "BookName",description: "Name of the book",   type: "string", example: "The Shadow"     },
  { name: "Rating",  description: "Rating of the book", type: "number", example: 4               }
];

console.log(
  JSON.stringify(
    generateManifestSchema(payload, variables),
    null,
    2
  )
);







