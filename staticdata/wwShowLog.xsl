<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns="http://www.w3.org/2000/svg">
  <xsl:output method="html" omit-xml-declaration="yes" />

  <xsl:template match="/">
    <table>
      <xsl:apply-templates select="who">
        <xsl:sort select="@id" order="descending"/>
      </xsl:apply-templates>
    </table>
  </xsl:template>
  
  <xsl:template match="who">    
    <tr>
    <xsl:apply-templates select="task">
      <xsl:sort select="@timestamp" order="descending" />
    </xsl:apply-templates>
    </tr>
  </xsl:template>
  
  <xsl:template match="task">
    <xsl:for-each select="@*">
      <td><xsl:value-of select="."/></td>
    <xsl:for-each>
  </xsl:template>
      
</xsl:stylesheet>
