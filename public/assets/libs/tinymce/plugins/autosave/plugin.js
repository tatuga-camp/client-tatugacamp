!function(){"use strict";var e,t=tinymce.util.Tools.resolve("tinymce.PluginManager");let r=(e,t,r)=>{var a;return!!r(e,t.prototype)||(null===(a=e.constructor)||void 0===a?void 0:a.name)===t.name},a=e=>{let t=typeof e;return null===e?"null":"object"===t&&Array.isArray(e)?"array":"object"===t&&r(e,String,(e,t)=>t.isPrototypeOf(e))?"string":t},o=e=>"string"===a(e),s=(e=void 0,t=>e===t);var n=tinymce.util.Tools.resolve("tinymce.util.Delay"),i=tinymce.util.Tools.resolve("tinymce.util.LocalStorage"),l=tinymce.util.Tools.resolve("tinymce.util.Tools");let u=e=>e.dispatch("RestoreDraft"),m=e=>e.dispatch("StoreDraft"),d=e=>e.dispatch("RemoveDraft"),v=e=>{let t=/^(\d+)([ms]?)$/.exec(e);return(t&&t[2]?({s:1e3,m:6e4})[t[2]]:1)*parseInt(e,10)},f=e=>t=>t.options.get(e),c=e=>{let t=e.options.register,r=e=>{let t=o(e);return t?{value:v(e),valid:t}:{valid:!1,message:"Must be a string."}};t("autosave_ask_before_unload",{processor:"boolean",default:!0}),t("autosave_prefix",{processor:"string",default:"tinymce-autosave-{path}{query}{hash}-{id}-"}),t("autosave_restore_when_empty",{processor:"boolean",default:!1}),t("autosave_interval",{processor:r,default:"30s"}),t("autosave_retention",{processor:r,default:"20m"})},p=f("autosave_ask_before_unload"),g=f("autosave_restore_when_empty"),y=f("autosave_interval"),D=f("autosave_retention"),h=e=>{let t=document.location;return e.options.get("autosave_prefix").replace(/{path}/g,t.pathname).replace(/{query}/g,t.search).replace(/{hash}/g,t.hash).replace(/{id}/g,e.id)},_=(e,t)=>{if(s(t))return e.dom.isEmpty(e.getBody());{let r=l.trim(t);if(""===r)return!0;{let t=new DOMParser().parseFromString(r,"text/html");return e.dom.isEmpty(t)}}},I=e=>{var t;let r=parseInt(null!==(t=i.getItem(h(e)+"time"))&&void 0!==t?t:"0",10)||0;return!(new Date().getTime()-r>D(e))||(b(e,!1),!1)},b=(e,t)=>{let r=h(e);i.removeItem(r+"draft"),i.removeItem(r+"time"),!1!==t&&d(e)},w=e=>{let t=h(e);!_(e)&&e.isDirty()&&(i.setItem(t+"draft",e.getContent({format:"raw",no_events:!0})),i.setItem(t+"time",new Date().getTime().toString()),m(e))},S=e=>{var t;let r=h(e);I(e)&&(e.setContent(null!==(t=i.getItem(r+"draft"))&&void 0!==t?t:"",{format:"raw"}),u(e))},E=e=>{let t=y(e);n.setEditorInterval(e,()=>{w(e)},t)},R=e=>{e.undoManager.transact(()=>{S(e),b(e)}),e.focus()},T=e=>({hasDraft:()=>I(e),storeDraft:()=>w(e),restoreDraft:()=>S(e),removeDraft:t=>b(e,t),isEmpty:t=>_(e,t)});var M=tinymce.util.Tools.resolve("tinymce.EditorManager");let x=e=>{e.editorManager.on("BeforeUnload",e=>{let t;l.each(M.get(),e=>{e.plugins.autosave&&e.plugins.autosave.storeDraft(),!t&&e.isDirty()&&p(e)&&(t=e.translate("You have unsaved changes are you sure you want to navigate away?"))}),t&&(e.preventDefault(),e.returnValue=t)})},B=e=>t=>{t.setEnabled(I(e));let r=()=>t.setEnabled(I(e));return e.on("StoreDraft RestoreDraft RemoveDraft",r),()=>e.off("StoreDraft RestoreDraft RemoveDraft",r)},P=e=>{E(e);let t=()=>{R(e)};e.ui.registry.addButton("restoredraft",{tooltip:"Restore last draft",icon:"restore-draft",onAction:t,onSetup:B(e)}),e.ui.registry.addMenuItem("restoredraft",{text:"Restore last draft",icon:"restore-draft",onAction:t,onSetup:B(e)})};t.add("autosave",e=>(c(e),x(e),P(e),e.on("init",()=>{g(e)&&e.dom.isEmpty(e.getBody())&&S(e)}),T(e)))}();