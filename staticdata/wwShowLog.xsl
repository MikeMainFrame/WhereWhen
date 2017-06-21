<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns="http://www.w3.org/2000/svg">
  <xsl:output method="xml" omit-xml-declaration="yes" />

  <xsl:template match="/">
    <svg viewBox="0 0 2400 1400" style="background: #000 ; font-family: 'Racing Sans One'"  id="zcanvas2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <link xmlns="http://www.w3.org/1999/xhtml" href="http://fonts.googleapis.com/css?family=Racing+Sans+One|Six+Caps" type="text/css" rel="stylesheet" />
      </defs>
      <xsl:apply-templates select="who">
        <xsl:sort select="@id" order="descending"/>
      </xsl:apply-templates>
    </svg>
  </xsl:template>
  
  <!-- each id -->
  
  <xsl:template match="who">
    
    <rect width="600" height="60" x="{$x}" y="{$y}" rx="5" />      
  </xsl:template>
  
  <xsl:template match="task">
    <text x="{$x}" y="{$y}" rx="5" />      
  </xsl:template>

</xsl:stylesheet>
