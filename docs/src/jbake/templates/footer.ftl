    </div>
    
    <div id="footer">
      <div class="container">
        <table class='footer'><tr>
        <td class='left'>${published_date?string("dd MMMM yyyy")}</td>
        <td> </td>
        <td class='right'><span class="muted credit">&copy; 2021-2022 Old Dominion University</span></td>
        </tr></table>
      </div>
    </div>
    
    <script src="<#if (content.rootpath)??>${content.rootpath}<#else></#if>js/jquery-1.11.1.min.js"></script>
    
  </body>
</html>