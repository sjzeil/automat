<div class="leftPart">
  <div class="menuBlock">
    <span class="menuBlockHeader"><a href="<#if
										   (content.rootpath)??>${content.rootpath}<#else></#if>index.html">Home</a></span>
  </div>
  <div class="menuBlock">
    <span class="menuBlockHeader"><a href='studentsManual.html'>Students' Reference Manual</a></span>
    ${content.tags}
    <#assign relatedTags = tags?filter(tag -> tag.name == "student")>
    <#assign relatedTag = relatedTags?first>
    <ul>
        <#list relatedTag.tagged_documents as article>
               <li>
                   <a href="${content.rootpath}${article.uri}">${article.title}</a>
               </li>
        </#list>
    </ul>
  </div>

  <div class="menuBlock">
    <span class="menuBlockHeader"><a href='instructorsManual.html'>Instructors' Reference Manual</a></span>
    <#assign relatedTags = tags?filter(tag -> tag.name == "instructor")>
    <#assign relatedTag = relatedTags?first>
    <ul>
        <#list relatedTag.tagged_documents as article>
            <li>
                <a href="${content.rootpath}${article.uri}">${article.title}</a>
            </li>
        </#list>
    </ul>
  </div>

  
  </div>
