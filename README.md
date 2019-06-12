# JSON to Dotenv

Use this Deno script to parse a json file and output a .env file

## Usage:

```
deno json_to_dotenv.ts path/to/file.json path/to/.env
```

### Example JSON Input:

```
{
  key: 'string'
  someKey: 1234,
  anotherKey: true,
  nullKey: null,
  parentKey: {
    key: 'string'
    someKey: 1234,
    anotherKey: true,
    nullKey: null,
  },
  arrayKey: [
    'value',
    'someValue',
    'anotherValue',
  ],
}
```

### Example Dotenv Output:

```
KEY=string
SOMEKEY=1234
ANOTHERKEY=true
NULLKEY=null
PARENTKEY_KEY=string
PARENTKEY_KEY=string
PARENTKEY_SOMEKEY=1234
PARENTKEY_ANOTHERKEY=true
PARENTKEY_NULLKEY=null
ARRAYKEY=value,someValue,anotherValue
```
