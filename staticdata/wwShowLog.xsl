
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns="http://www.w3.org/2000/svg">
  <xsl:output method="html" omit-xml-declaration="yes" />
  <xsl:key name="groupTask" match="//task" use="@address"/>
  <xsl:decimal-format name="zformat" decimal-separator="," grouping-separator="." />


  <xsl:template match="root">
    <html><head>
    <meta charset="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
<style>
       body { font-family: sans-serif; font-size: 1em}
       table, th, td {border: 1px solid #EEE; border-collapse: collapse ; padding: 3px}
       td {padding: 0.5em ; font-size: 0.8em} 
       th {text-align: center; font-size: 2em} 
       *.dark {background: #ddd ; text-translate: uppercase} 
       *.fat {font-weight: 900} 
       *.Right {text-align:right} 
       *.timestamp {text-align:right} 
    </style>
    </head>
    <script type="application/ecmascript" href="staticdata/postTime.js" ></script>
    <body>
    <table>
      <xsl:apply-templates select="who">
        <xsl:sort select="@id" order="descending"/>
      </xsl:apply-templates>
    </table>
    </body>
    
    </html>
  </xsl:template>
  
  
  <xsl:template match="who">    
    <tr><th colspan="5"><xsl:value-of select="@id"/></th>
    <xsl:apply-templates select="task">
      <xsl:sort select="@address" order="ascending" />
      <xsl:sort select="@id" order="descending" data-type="number" />      
      <xsl:sort select="@timestamp" order="descending" />
    </xsl:apply-templates>
    </tr>
  </xsl:template>
  
  
  <xsl:template match="task">
      
    <xsl:if test="position() = last()">
      <xsl:for-each select="//task[generate-id() = generate-id( key('groupTask', @address) [1] )]">                
        <xsl:call-template name="group">
          <xsl:with-param name="adr" select="@address"/>    
        </xsl:call-template>      
      </xsl:for-each>
    </xsl:if>
    
  </xsl:template>
  
  
  <xsl:template name="group">
    <xsl:param name="adr"/>
    <tr>
      <td class="dark">address</td>
      <td class="dark">id</td>
      <td class="dark">timestamp</td>
      <td class="dark">duration<br>minuttes</br></td>
      <td class="dark">geo</td>        
    </tr>
    
        
    <xsl:for-each select="//task[@address = $adr]">        
      <tr>
        <xsl:if test="position() = 1"><td><xsl:attribute name="rowspan"><xsl:value-of select="count(//task[@address = $adr])" /></xsl:attribute><xsl:value-of select="@address"/></td></xsl:if>
        <td><xsl:value-of select="@id"/></td>
        <td class="timestamp"><xsl:value-of select="@timestamp"/></td>
        <td class="right fat"><xsl:value-of select="format-number(((@duration div 60000) + 1), '#.###.###', 'zformat')" /></td>
        <td>lat:<xsl:value-of select="@lat"/> lng:<xsl:value-of select="@lng"/></td>        
      </tr>
    </xsl:for-each>          
    
    <tr>
      <td colspan="4" class="fat Right"><xsl:value-of select="format-number(((sum(//task[@address = $adr]/@duration) div 60000) + 1), '#.###.###', 'zformat')" /></td>
      <td></td>
    </tr>       
      
    
  </xsl:template>
  
</xsl:stylesheet>
