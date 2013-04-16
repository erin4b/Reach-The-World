<?php
// $Id: page.tpl.php,v 1.18.2.1 2009/04/30 00:13:31 goba Exp $
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
  <head>
    <?php print $head ?>
    <title><?php print $head_title ?></title>
    <?php print $styles ?>
    <?php print $scripts ?>
    <!--[if lt IE 7]>
      <?php print phptemplate_get_ie_styles(); ?>
    <![endif]-->
  </head>
  <body<?php print phptemplate_body_class($left, $right); ?>>

<!-- Layout -->
  <?php if($header): ?>
	<div id="header-region" class="clear-block">
		<?php print $header; ?>
	</div>
   <?php endif; ?>
    <div id="wrapper">
		<div id="container" class="clear-block">
			<div id="header-home">
				<div id="logo">  
					<div id="logo-home"></div>
					<div id="navigation-home">
						<div id="navigation-home-cap-left"></div>
						<div id="navigation-home-center"></div>
						<div id="navigation-home-cap-right"></div>
					</div>
				</div>

			</div>  
			<?php if($content_top): ?>
			<div id="content-top" class="clear-block">
				<?php print $content_top; ?>
			</div>
			<?php endif; ?>
			
			<?php if ($left): ?>
			<div id="sidebar-left" class="sidebar">
				<?php if ($search_box): ?><div class="block block-theme"><?php print $search_box ?></div><?php endif; ?>
				<?php print $left ?>
			</div>
			<?php endif; ?>
			
			
				<div id="center">
					<div id="squeeze">
								<?php if ($tabs): print '<div id="tabs-wrapper" class="clear-block">'; endif; ?>
								<?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?>
								<?php if ($tabs): print '<ul class="tabs primary">'. $tabs .'</ul></div>'; endif; ?>
								<?php if ($tabs2): print '<ul class="tabs secondary">'. $tabs2 .'</ul>'; endif; ?>
								<?php if ($show_messages && $messages): print $messages; endif; ?>
								<?php print $help; ?>
								<div class="clear-block">
									<?php print $content ?>
								</div>
								<?php print $feed_icons ?>
								<div id="footer">
									<?php print $footer_message . $footer ?>
								</div>
					</div> <!-- /.left-corner, /.right-corner, /#squeeze, /#center -->
					<div id="geogames" class="clear-block">
						<div id="geogames-cap">
						</div>
						<div id="geogames-middle">
						</div>
						<div id="geogames-image">
						</div>
					</div>
				</div> <!-- main content -->
				
			 
		</div>
	</div>  <!-- /wrapper -->

<!-- /layout -->
 
  <?php print $closure ?>
  	<div id="page-footer">
		<div id="footer-content">
			footer
		</div>
	</div>
  </body>
</html>
