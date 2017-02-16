<?php

namespace CodexEditor\Entry;

class Factory {

    /**
     * Get block class
     * @param array $data
     *
     * @return object
     */
    public static function getBlock(array $data)
    {
        if (isset($data['type']) && !empty($data['type'])) {
            $type = ucfirst(trim(strtolower($data['type'])));

            /**
             * allowed datatypes from redactor
             */
            $allowedBlockNameTypes = self::getAllowedBlockTypes();

            /**
             * Returns correct type name
             *
             * @var $blockName    - correct type name
             * @var $allowedTypes - list of allowed type names
             */
            foreach ($allowedBlockNameTypes as $blockName => $allowedTypes) {
                if (in_array($data['type'], $allowedTypes)) {
                    $type = $blockName;
                    break;
                }
            }

            /**
             * Getting block
             * @var $blockClass - Block Class
             */
            $blockClass = "CodexEditor\\Entry\\Block\\" . $type;

            if (class_exists($blockClass)) {

                /** Call Base Class constructor */
                $block = new $blockClass($data);

                /** Call implemented initialize method */
                $block->initialize();

                return $block;
            }
        }

        return null;
    }

    public static function getAllowedBlockTypes()
    {
        return include ('Config/blockTypes.php');
    }

}