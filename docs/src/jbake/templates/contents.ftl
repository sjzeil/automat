<#include "header.ftl">

	<div class="page-header">
		<h1><#escape x as x?xml>${content.title}</#escape></h1>
	</div>
	<div class="center">
	    <#include "menu.ftl">
		<div class="rightPart">
			<p>${content.body}</p>
		</div>
	</div>
	<#assign relatedTags = tags?filter(tag -> tag.name == content.directory)>
    <#assign relatedTag = relatedTags?first>
    <ul>
        <#list relatedTag.tagged_documents as article>
               <li>
                   <a href="${content.rootpath}${article.uri}">${article.title}</a>
               </li>
        </#list>
    </ul>


<#include "footer.ftl">