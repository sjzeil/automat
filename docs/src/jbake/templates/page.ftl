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
	<hr />

<#include "footer.ftl">