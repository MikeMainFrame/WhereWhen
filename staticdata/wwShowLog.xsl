<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns="http://www.w3.org/2000/svg">
  <xsl:output method="html" omit-xml-declaration="yes" />

  <xsl:template match="root">
    <html><head>
    <meta charset="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
<style>
       table, th, td {border: 1px solid black; border-collapse: collapse ; padding: 3px}
       th {text-align: center; font-size: 2em} 
    </style></head><body>
    <table>
      <xsl:apply-templates select="who">
        <xsl:sort select="@id" order="descending"/>
      </xsl:apply-templates>
    </table>
    </body></html>
  </xsl:template>
  
  <xsl:template match="who">    
    <tr><th colspan="6"><xsl:value-of select="@id"/></th>
    <xsl:apply-templates select="task">
      <xsl:sort select="@timestamp" order="descending" />
    </xsl:apply-templates>
    </tr>
  </xsl:template>
  
  <xsl:template match="task">
    <xsl:if test="position() = 1"><tr><xsl:for-each select="@*"><td style="background: #DDD"><xsl:value-of select="local-name()"/></td></xsl:for-each></tr></xsl:if>
    <tr>
    <xsl:for-each select="@*">  
      <td><xsl:value-of select="."/></td>
    </xsl:for-each>
    </tr>
  </xsl:template>
      
</xsl:stylesheet>
