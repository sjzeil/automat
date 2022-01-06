<div class="leftPart">
  <div class="menuBlock">
    <span class="menuBlockHeader"><a href="<#if
										   (content.rootpath)??>${content.rootpath}<#else></#if>index.html">Home</a></span>
  </div>
  <div class="menuBlock">
  <hr/>
  </div>
  <div class="menuBlock">
    <span class="menuBlockHeader"><a href='studentsManual.html'>For Students</a></span>
    <#if (content.directory?? && content.directory=='student') || (content.manual?? && content.manual == 'student')>
      <ul>
        <#list published_content?filter(x -> x.manual??)?sort_by("sequence") as article>
          <#if article.manual?? && article.manual='student'>
               <li>
                   <a href="${content.rootpath}${article.uri}">${article.title}</a>
               </li>
          </#if>
        </#list>
      </ul>
    </#if>
  </div>

  <div class="menuBlock">
  <hr/>
  </div>
  <div class="menuBlock">
    <span class="menuBlockHeader"><a href='instructorsManual.html'>For Instructors</a></span>
    <#if (content.directory?? && content.directory=='instructor') || (content.manual?? && content.manual == 'instructor')>
      <ul>
        <#list published_content?filter(x -> x.manual??)?sort_by("sequence") as article>
          <#if article.manual?? && article.manual='instructor'>
            <li>
                <a href="${content.rootpath}${article.uri}">${article.title}</a>
            </li>
          </#if>
        </#list>
      </ul>
    </#if>
  </div>

  
  </div>
