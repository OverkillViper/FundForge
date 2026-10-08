<?php

namespace App\Support;

final class Money
{
    public static function add($left, $right): string
    {
        return self::format(self::toMinorUnits($left) + self::toMinorUnits($right));
    }

    public static function subtract($left, $right): string
    {
        return self::format(self::toMinorUnits($left) - self::toMinorUnits($right));
    }

    public static function compare($left, $right): int
    {
        return self::toMinorUnits($left) <=> self::toMinorUnits($right);
    }

    private static function toMinorUnits($amount): int
    {
        $value = trim((string) $amount);

        if (!preg_match('/^([+-]?)(\d+)(?:\.(\d*))?$/', $value, $parts)) {
            $value = number_format((float) $value, 2, '.', '');
            preg_match('/^([+-]?)(\d+)(?:\.(\d*))?$/', $value, $parts);
        }

        $wholeUnits = (int) $parts[2];
        $fractionalUnits = (int) str_pad(
            substr($parts[3] ?? '', 0, 2),
            2,
            '0'
        );
        $minorUnits = ($wholeUnits * 100) + $fractionalUnits;

        return ($parts[1] ?? '') === '-'
            ? -$minorUnits
            : $minorUnits;
    }

    private static function format(int $minorUnits): string
    {
        $absoluteCents = abs($minorUnits);
        $wholeUnits = intdiv($absoluteCents, 100);
        $fractionalUnits = str_pad(
            (string) ($absoluteCents % 100),
            2,
            '0',
            STR_PAD_LEFT
        );

        return ($minorUnits < 0 ? '-' : '')
            .$wholeUnits
            .'.'
            .$fractionalUnits;
    }
}