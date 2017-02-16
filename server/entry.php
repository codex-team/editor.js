<?php

/** Include interfaces */
require_once ('./Blocks/Interfaces/Block.php');
require_once ('./Blocks/Interfaces/HTMLPurifyable.php');

/** Include classes */
require_once ('./Structure.php');
require_once ('./Blocks/Base.php');
require_once ('./Blocks/Factory.php');
require_once ('./Blocks/Paragraph.php');
require_once ('./Blocks/Header.php');
require_once ('./vendor/autoload.php');

use CodexEditor\Entry\Structure;

$structure = new Structure($_POST['entry']);

$structure->getEntryData();