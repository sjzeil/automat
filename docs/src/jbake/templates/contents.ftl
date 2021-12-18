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
	<ul>
        <#list published_content?filter(x -> x.manual??)?sort_by("sequence") as article>
            <#if article.manual?? && article.manual=content.directory>

               <li>
                   <a href="${content.rootpath}${article.uri}">${article.title}</a>
               </li>
			</#if>
        </#list>
    </ul>


<#include "footer.ftl">