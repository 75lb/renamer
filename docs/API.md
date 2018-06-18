<a name="module_renamer"></a>

## renamer
Rename files in bulk.


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
| [options.find] | <code>sting</code> \| <code>RegExp</code> | Find expression. |
| [options.replace] | <code>string</code> |  |
| [options.dryRun] | <code>boolean</code> |  |
| [options.force] | <code>boolean</code> |  |
| [options.view] | <code>string</code> | The default view outputs one line per rename. Set `--view detail` to see more info including a diff. |
| [options.plugin] | <code>Array.&lt;string&gt;</code> |  |

<a name="module_renamer--Renamer+event_rename-start"></a>

#### "rename-start"
Rename start

**Kind**: event emitted by [<code>Renamer</code>](#exp_module_renamer--Renamer)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| from | <code>string</code> | The filename before rename. |
| to | <code>string</code> | The filename after rename. |
| renamed | <code>boolean</code> | True if the file was renamed. |

