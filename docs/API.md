<a name="module_renamer"></a>

## renamer

* [renamer](#module_renamer)
    * [Renamer](#exp_module_renamer--Renamer) ⏏
        * [.rename(options)](#module_renamer--Renamer+rename)
        * ["rename-start"](#module_renamer--Renamer+event_rename-start)

<a name="exp_module_renamer--Renamer"></a>

### Renamer ⏏
**Kind**: Exported class  
<a name="module_renamer--Renamer+rename"></a>

#### renamer.rename(options)
**Kind**: instance method of [<code>Renamer</code>](#exp_module_renamer--Renamer)  
**Emits**: [<code>rename-start</code>](#module_renamer--Renamer+event_rename-start)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The renamer options |
| [options.files] | <code>Array.&lt;string&gt;</code> | One or more glob patterns or names of files to rename. |
| [options.find] | <code>sting</code> |  |
| [options.replace] | <code>string</code> |  |
| [options.insensitive] | <code>boolean</code> |  |
| [options.dryRun] | <code>boolean</code> |  |
| [options.regexp] | <code>boolean</code> |  |
| [options.force] | <code>boolean</code> |  |
| [options.plugin] | <code>Array.&lt;string&gt;</code> |  |

<a name="module_renamer--Renamer+event_rename-start"></a>

#### "rename-start"
Rename start

**Kind**: event emitted by [<code>Renamer</code>](#exp_module_renamer--Renamer)  
**Properties**

| Name | Type |
| --- | --- |
| from | <code>string</code> | 
| to | <code>string</code> | 

