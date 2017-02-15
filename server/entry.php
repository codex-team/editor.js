<?php

/** Include classes */
require_once ('./Structure.php');
require_once ('./Blocks/Base.php');
require_once ('./Blocks/Factory.php');
require_once ('./Blocks/Paragraph.php');

use CodexEditor\Entry\Structure;

$structure = new Structure($_POST['entry']);